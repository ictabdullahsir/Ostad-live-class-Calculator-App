console.log("Hello World! in the console from script.js");
let displayNumber = 0
let memory = 0
let operation = ""              
let displayDiv = document.getElementById("display");    
displayDiv.textContent = displayNumber;

const sevenBtn = document.getElementById("seven");  
const eightBtn = document.getElementById("eight");
const nineBtn = document.getElementById("nine");
const fourBtn = document.getElementById("four");
const fiveBtn = document.getElementById("five");
const sixBtn = document.getElementById("six");
const oneBtn = document.getElementById("one");
const twoBtn = document.getElementById("two");
const threeBtn = document.getElementById("three");
const zeroBtn = document.getElementById("zero");
const clearBtn = document.getElementById("clear");
const addBtn = document.getElementById("add");
const multBtn = document.getElementById("multiply");
const divBtn = document.getElementById("divide");   
const subBtn = document.getElementById("subtract");
const equalsBtn = document.getElementById("equals");

equalsBtn.addEventListener("click", function() {
    if(operation === "add") {
        const result = memory + parseInt(displayDiv.textContent);
        displayDiv.textContent = result;
    } else if(operation === "multiply") {
        const result = memory * parseInt(displayDiv.textContent);
        displayDiv.textContent = result;
    } else if(operation === "divide") {
        const result = memory / parseInt(displayDiv.textContent);
        displayDiv.textContent = result;
    } else if(operation === "subtract") {
        const result = memory - parseInt(displayDiv.textContent);
        displayDiv.textContent = result;
    }
});
addBtn.addEventListener("click", function() {
    memory = parseInt(displayDiv.textContent);
    displayDiv.textContent = "0";
    operation = "add";
});
multBtn.addEventListener("click", function() {
    memory = parseInt(displayDiv.textContent);
    displayDiv.textContent = "0";
    operation = "multiply";
});
divBtn.addEventListener("click", function() {
    memory = parseInt(displayDiv.textContent);
    displayDiv.textContent = "0";
    operation = "divide";
}); 
subBtn.addEventListener("click", function() {
    memory = parseInt(displayDiv.textContent);
    displayDiv.textContent = "0";
    operation = "subtract";
});
clearBtn.addEventListener("click", function() {
    displayDiv.textContent = "0";
    memory = 0;
    operation = "";
});
sevenBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "7";
    } else {
        displayDiv.textContent += "7";
    }
}); 
eightBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "8";
    } else {
        displayDiv.textContent += "8";
    }
});
nineBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "9";
    } else {
        displayDiv.textContent += "9";
    }
});
fourBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "4";
    } else {
        displayDiv.textContent += "4";
    }
});
fiveBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "5";
    } else {
        displayDiv.textContent += "5";
    }
});
sixBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "6";
    } else {
        displayDiv.textContent += "6";
    }
});
oneBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "1";
    } else {
        displayDiv.textContent += "1";
    }
});
twoBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "2";
    } else {
        displayDiv.textContent += "2";
    }
});
threeBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "3";
    } else {
        displayDiv.textContent += "3";
    }
});
zeroBtn.addEventListener("click", function() {
    if(displayDiv.textContent === "0") {
        displayDiv.textContent = "0";
    } else {
        displayDiv.textContent += "0";
    }
});

