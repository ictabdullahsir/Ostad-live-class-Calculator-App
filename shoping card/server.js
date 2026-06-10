const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ─── bKash Sandbox Credentials ───────────────────────────────────────────────
// Replace with your actual credentials from https://developer.bka.sh
const BKASH_CONFIG = {
  base_url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta",
  app_key: process.env.BKASH_APP_KEY || "YOUR_APP_KEY",
  app_secret: process.env.BKASH_APP_SECRET || "YOUR_APP_SECRET",
  username: process.env.BKASH_USERNAME || "YOUR_USERNAME",
  password: process.env.BKASH_PASSWORD || "YOUR_PASSWORD",
};

// ─── In-memory store (use a DB in production) ─────────────────────────────────
const orders = {};
let bkashToken = null;
let tokenExpiry = null;

// ─── Products ─────────────────────────────────────────────────────────────────
const products = [
  { id: 1, name: "Wireless Earbuds", price: 1299, image: "🎧", category: "Electronics" },
  { id: 2, name: "Smart Watch", price: 3499, image: "⌚", category: "Electronics" },
  { id: 3, name: "Cotton T-Shirt", price: 450, image: "👕", category: "Clothing" },
  { id: 4, name: "Running Shoes", price: 2199, image: "👟", category: "Footwear" },
  { id: 5, name: "Coffee Maker", price: 4500, image: "☕", category: "Kitchen" },
  { id: 6, name: "Backpack", price: 1750, image: "🎒", category: "Accessories" },
];

// ─── bKash Token Helper ────────────────────────────────────────────────────────
async function getBkashToken() {
  const now = Date.now();
  if (bkashToken && tokenExpiry && now < tokenExpiry) return bkashToken;

  const res = await fetch(`${BKASH_CONFIG.base_url}/tokenized/checkout/token/grant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      username: BKASH_CONFIG.username,
      password: BKASH_CONFIG.password,
    },
    body: JSON.stringify({
      app_key: BKASH_CONFIG.app_key,
      app_secret: BKASH_CONFIG.app_secret,
    }),
  });

  const data = await res.json();
  if (data.id_token) {
    bkashToken = data.id_token;
    tokenExpiry = now + (data.expires_in - 60) * 1000;
    return bkashToken;
  }
  throw new Error(data.msg || "Failed to get bKash token");
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Get products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Create bKash payment
app.post("/api/bkash/create", async (req, res) => {
  const { amount, cartItems, customerName, customerPhone } = req.body;

  if (!amount || !cartItems?.length) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  const orderId = uuidv4();
  const merchantInvoiceNumber = `INV-${Date.now()}`;

  try {
    const token = await getBkashToken();

    const payload = {
      mode: "0011",
      payerReference: customerPhone || "01XXXXXXXXX",
      callbackURL: `${req.protocol}://${req.get("host")}/api/bkash/callback`,
      amount: String(amount),
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber,
    };

    const response = await fetch(
      `${BKASH_CONFIG.base_url}/tokenized/checkout/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: token,
          "x-app-key": BKASH_CONFIG.app_key,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (data.bkashURL) {
      // Store pending order
      orders[data.paymentID] = {
        orderId,
        paymentID: data.paymentID,
        merchantInvoiceNumber,
        amount,
        cartItems,
        customerName,
        customerPhone,
        status: "pending",
        createdAt: new Date(),
      };

      return res.json({
        success: true,
        bkashURL: data.bkashURL,
        paymentID: data.paymentID,
      });
    }

    return res.status(400).json({ error: data.statusMessage || "Payment creation failed" });
  } catch (err) {
    console.error("bKash create error:", err.message);
    res.status(500).json({ error: "Payment service unavailable. Check bKash credentials." });
  }
});

// bKash callback (redirect from bKash after user pays)
app.get("/api/bkash/callback", async (req, res) => {
  const { paymentID, status } = req.query;

  if (status === "cancel") {
    return res.redirect("/?payment=cancelled");
  }
  if (status === "failure") {
    return res.redirect("/?payment=failed");
  }

  try {
    const token = await getBkashToken();

    const response = await fetch(
      `${BKASH_CONFIG.base_url}/tokenized/checkout/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: token,
          "x-app-key": BKASH_CONFIG.app_key,
        },
        body: JSON.stringify({ paymentID }),
      }
    );

    const data = await response.json();

    if (data.statusCode === "0000") {
      if (orders[paymentID]) {
        orders[paymentID].status = "completed";
        orders[paymentID].trxID = data.trxID;
        orders[paymentID].completedAt = new Date();
      }
      return res.redirect(`/?payment=success&trxID=${data.trxID}&paymentID=${paymentID}`);
    }

    res.redirect(`/?payment=failed&reason=${encodeURIComponent(data.statusMessage)}`);
  } catch (err) {
    console.error("bKash execute error:", err.message);
    res.redirect("/?payment=failed");
  }
});

// Query payment status
app.get("/api/bkash/status/:paymentID", async (req, res) => {
  const { paymentID } = req.params;
  const order = orders[paymentID];
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Get all orders (admin view)
app.get("/api/orders", (req, res) => {
  res.json(Object.values(orders));
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🛍️  Shop running at http://localhost:${PORT}`);
  console.log(`💳  bKash environment: Sandbox`);
  console.log(`\n⚠️  Set credentials in .env file before testing payments\n`);
});
