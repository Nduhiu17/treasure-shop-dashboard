import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "../../components/ui/dialog";
import Loader from "../../components/ui/Loader";
import { Button } from "../../components/ui/button";

const PAY_API = process.env.REACT_APP_API_BASE_URL + '/api/orders/pay';

export default function PayPalModal({ isOpen, onClose, orderId, amount, onSuccess }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const paypalRef = useRef();

  useEffect(() => {
    if (!isOpen) return;
    let script;
    const paypalNode = paypalRef.current;
    function renderPayPal() {
      if (!paypalNode) return;
      paypalNode.innerHTML = "";
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: amount.toFixed(2) } }],
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
                        return_url: "localhost:8080/api/orders/pay",
                        cancel_url: "localhost:8080/api/orders/paypal/cancel",
                        user_action: "PAY_NOW"
                      }
                    }
                  },
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: (amount && Number(amount) > 0 ? Number(amount).toFixed(2) : "1.00")
                      }
                    }
                  ],
                  amount: (amount && Number(amount) > 0 ? Number(amount).toFixed(2) : "1.00")
                })
              });
              onSuccess();
              onClose();
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
    if (!window.paypal) {
      script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=AZX-bfSi6vb-2Q7Omta3FpCtrIBwnx0JfUbnyQQ2q5_1VpNXUtoQwcazPwseOcYiijj24e6GH_7pnDVT&currency=USD";
      script.async = true;
      script.onload = renderPayPal;
      script.onerror = () => setError("Failed to load PayPal. Try again later.");
      document.body.appendChild(script);
    } else {
      renderPayPal();
    }
    return () => {
      if (paypalNode) paypalNode.innerHTML = "";
      if (script) script.remove();
    };
    // eslint-disable-next-line
  }, [isOpen, orderId, amount]);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Pay for Your Order">
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="text-lg text-blue-800 mb-2">Amount: <span className="font-bold">${(amount ? Number(amount).toFixed(2) : "0.00")}</span> USD</div>
        <div ref={paypalRef} className="w-56 min-h-[48px] flex items-center justify-center" />
        {paying && <div className="mt-2 text-blue-600 flex items-center gap-2"><Loader className="w-5 h-5" /> Processing payment...</div>}
        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}
        <Button onClick={onClose} className="mt-4 bg-gray-200 text-blue-900 hover:bg-gray-300">Cancel</Button>
      </div>
    </Dialog>
  );
}
