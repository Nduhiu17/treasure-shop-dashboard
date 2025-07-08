import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PayWithPayPal from "../features/orders/PayWithPayPal";

export default function PayOrderPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get amount from location.state or query string
  let amount = location.state?.amount;
  if (!amount) {
    const params = new URLSearchParams(location.search);
    amount = params.get("amount");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 mt-12">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">Complete Your Payment</h2>
        <PayWithPayPal
          orderId={orderId}
          amount={amount}
          onSuccess={() => navigate('/profile')}
          onCancel={() => navigate('/profile')}
        />
      </div>
    </div>
  );
}
