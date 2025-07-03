import React from "react";

// Placeholder for PayPal payment step
export default function PayWithPayPal({ orderId, amount, onSuccess, onCancel }) {
  // Ensure amount is a number for toFixed, fallback to 0 if not
  let displayAmount = 0;
  if (typeof amount === "number" && !isNaN(amount)) {
    displayAmount = amount;
  } else if (typeof amount === "string" && amount !== "-") {
    const parsed = parseFloat(amount);
    displayAmount = isNaN(parsed) ? 0 : parsed;
  }
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Pay for Your Order</h2>
      <div className="mb-6 text-blue-800 text-lg">Order ID: <span className="font-mono">{orderId}</span></div>
      <div className="mb-8 text-3xl font-extrabold text-green-600">${displayAmount.toFixed(2)}</div>
      {/* Integrate PayPal button here */}
      <div className="mb-6">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-xl shadow" disabled>
          Pay with PayPal (Coming Soon)
        </button>
      </div>
      <button className="text-blue-500 underline" onClick={onCancel}>Cancel and return</button>
    </div>
  );
}
