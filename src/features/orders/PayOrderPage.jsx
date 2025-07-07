import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PayWithPayPal from "./PayWithPayPal";

export default function PayOrderPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Get amount from location state or query param
  const amount = location.state?.amount || new URLSearchParams(location.search).get("amount") || 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <PayWithPayPal
        orderId={orderId}
        amount={amount}
        onSuccess={() => navigate("/admin/dashboard")}
        onCancel={() => navigate("/admin/dashboard")}
      />
    </div>
  );
}
