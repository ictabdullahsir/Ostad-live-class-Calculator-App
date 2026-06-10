# 🛍️ ShopBD — bKash Payment Integration

A full shopping cart with **bKash Tokenized Checkout** using Node.js and Express.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your bKash credentials to .env
cp .env.example .env
# Edit .env with your credentials

# 3. Run the server
npm start          # production
npm run dev        # development (with nodemon)
```

Visit: **http://localhost:3000**

---

## 🔑 Getting bKash Credentials

1. Register at **https://developer.bka.sh**
2. Create a Merchant App (Sandbox for testing)
3. Copy: `App Key`, `App Secret`, `Username`, `Password`
4. Paste into `.env`

### Sandbox Test Wallet
- **Number:** 01929918378
- **OTP:** 123456
- **PIN:** 12121

---

## 📁 Project Structure

```
bkash-shop/
├── server.js           ← Express server + bKash API
├── public/
│   └── index.html      ← Full shopping cart UI
├── .env                ← Your credentials (never commit this)
├── package.json
└── README.md
```

---

## 🔄 bKash Payment Flow

```
User clicks "Pay with bKash"
        │
        ▼
POST /api/bkash/create
   → Gets token from bKash
   → Creates payment session
   → Returns bkashURL
        │
        ▼
Browser redirects to bKash payment page
   → User enters PIN
        │
        ▼
bKash redirects to /api/bkash/callback?status=success
   → Server calls /execute to confirm
   → Order marked as completed
        │
        ▼
User redirected to /?payment=success&trxID=XXXXX
```

---

## 🛠️ API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/bkash/create` | Initiate bKash payment |
| GET | `/api/bkash/callback` | bKash redirect after payment |
| GET | `/api/bkash/status/:paymentID` | Check payment status |
| GET | `/api/orders` | List all orders |

---

## ⚠️ Production Checklist

- [ ] Replace in-memory `orders` store with a real DB (MongoDB/PostgreSQL)
- [ ] Add `dotenv` config: `require('dotenv').config()` at top of server.js
- [ ] Use HTTPS — bKash requires it for live
- [ ] Add webhook signature verification
- [ ] Implement idempotency for duplicate callbacks
- [ ] Set up proper session management

---

## 📦 Dependencies

- **express** — Web framework
- **uuid** — Unique order IDs
- **dotenv** — Environment variable loading
- **Node.js 18+** — Required for built-in `fetch`
