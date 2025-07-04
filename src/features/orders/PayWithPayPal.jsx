
import React, { useEffect, useRef, useState } from "react";

const PAY_API = process.env.REACT_APP_API_BASE_URL + '/api/orders/pay';
const PAYPAL_RETURN_URL = process.env.REACT_APP_API_BASE_URL + '/api/orders/pay';
const PAYPAL_CANCEL_URL = process.env.REACT_APP_API_BASE_URL + '/api/orders/paypal/cancel';

export default function PayWithPayPal({ orderId, amount, onSuccess, onCancel }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const paypalRef = useRef();
  const [paypalLoaded, setPaypalLoaded] = useState(!!window.paypal);

  // Always ensure amount is a valid number for PayPal
  let displayAmount = 0;
  if (typeof amount === "number" && !isNaN(amount)) {
    displayAmount = amount;
  } else if (typeof amount === "string" && amount !== "-") {
    const parsed = parseFloat(amount);
    displayAmount = isNaN(parsed) ? 0 : parsed;
  }

  useEffect(() => {
    let script;
    const paypalNode = paypalRef.current;
    function renderPayPal() {
      if (!paypalNode) return;
      paypalNode.innerHTML = "";
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: displayAmount.toFixed(2) } }],
          }),
          onApprove: async (data, actions) => {
            setPaying(true);
            try {
              await actions.order.capture();
              const jwt = localStorage.getItem("jwt_token");
              await fetch(PAY_API, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": jwt ? `Bearer ${jwt}` : ""
                },
                body: JSON.stringify({
                  order_id: orderId,
                  method: "paypal",
                  intent: "CAPTURE",
                  payment_info: {
                    paypal: {
                      experience_context: {
                        return_url: PAYPAL_RETURN_URL,
                        cancel_url: PAYPAL_CANCEL_URL,
                        user_action: "PAY_NOW"
                      }
                    }
                  },
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: (displayAmount && Number(displayAmount) > 0 ? Number(displayAmount).toFixed(2) : "1.00")
                      }
                    }
                  ],
                  amount: (displayAmount && Number(displayAmount) > 0 ? Number(displayAmount).toFixed(2) : "1.00")
                })
              });
              if (onSuccess) onSuccess();
            } catch (e) {
              setError("Payment failed. Please try again.");
            } finally {
              setPaying(false);
            }
          },
          onError: () => setError("PayPal payment failed. Try again."),
        }).render(paypalNode);
      }
    }
    if (!paypalNode) return;
    paypalNode.innerHTML = "";
    setError("");
    if (!window.paypal) {
      script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AZX-bfSi6vb-2Q7Omta3FpCtrIBwnx0JfUbnyQQ2q5_1VpNXUtoQwcazPwseOcYiijj24e6GH_7pnDVT&currency=USD";
      script.async = true;
      script.onload = () => {
        setPaypalLoaded(true);
        renderPayPal();
      };
      script.onerror = () => setError("Failed to load PayPal. Try again later.");
      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
      renderPayPal();
    }
    return () => {
      if (paypalNode) paypalNode.innerHTML = "";
      if (script) script.remove();
    };
    // eslint-disable-next-line
  }, [orderId, displayAmount]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-1 w-full flex items-center justify-center">
        {!paypalLoaded && (
          <div className="w-56 min-h-[48px] flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="ml-2 text-blue-500">Loading PayPal...</span>
          </div>
        )}
        <div ref={paypalRef} className="w-56 min-h-[48px] flex items-center justify-center" />
      </div>
      {paying && (
        <div className="mt-2 text-blue-600 flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span>Processing payment...</span>
        </div>
      )}
      {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
      <button className="text-blue-500 underline mt-4 flex items-center gap-1" type="button" onClick={onCancel}>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        <span>Cancel and return</span>
      </button>
    </div>
  );
}
