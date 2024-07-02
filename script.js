// Global variables
let price;
let cid;

// Function to handle purchase calculation
function calculateChange(price, cash, cid) {
  const currencyUnit = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
  };

  let changeDue = cash - price;
  let totalCID = cid.reduce((acc, curr) => acc + curr[1], 0);

  if (changeDue > totalCID) {
    return "Status: INSUFFICIENT_FUNDS";
  } else if (changeDue.toFixed(2) === totalCID.toFixed(2)) {
    // Check if exact change is possible
    let change = [];
    cid.forEach(item => {
      if (item[1] > 0) {
        change.push([item[0], item[1]]);
      }
    });
    return "Status: CLOSED " + change.map(item => item[0] + ": $" + item[1].toFixed(2)).join(" ");
  } else if (changeDue === 0) {
    return "No change due - customer paid with exact cash";
  }

  cid = cid.reverse();

  const change = [];
  cid.forEach(item => {
    let denomination = item[0];
    let denomValue = currencyUnit[denomination];
    
    if (changeDue >= denomValue && item[1] > 0) {
      let count = Math.min(Math.floor(changeDue / denomValue), Math.floor(item[1] / denomValue));
      changeDue -= count * denomValue;
      item[1] -= count * denomValue;
      change.push([denomination, count * denomValue]);
      changeDue = Math.round(changeDue * 100) / 100;
    }
  });

  if (changeDue > 0) {
    return "Status: INSUFFICIENT_FUNDS";
  } else {
    let result = "Status: OPEN";
    if (change.length > 0) {
      result += " " + change.map(item => item[0] + ": $" + item[1].toFixed(2)).join(" ");
    }
    return result;
  }
}

// Event listener for purchase button
document.getElementById("purchase-btn").addEventListener("click", function() {
  const cashInput = parseFloat(document.getElementById("cash").value);
  
  if (isNaN(cashInput) || cashInput <= 0) {
    alert("Please enter a valid cash amount.");
    return;
  }

  if (cashInput < price) {
    alert("Customer does not have enough money to purchase the item.");
    return;
  }

  const result = calculateChange(price, cashInput, cid);
  document.getElementById("change-due").textContent = result;
});
