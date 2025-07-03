import React, { useState } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import CreateOrder from "../features/orders/CreateOrder";
import PayWithPayPal from "../features/orders/PayWithPayPal";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";

export default function NewOrderPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Get initial selections from navigation state (if any)
  const initialSelections = location.state?.calculatorSelections || null;
  const [orderStep, setOrderStep] = useState("form"); // "form" | "payment"
  const [createdOrder, setCreatedOrder] = useState(null); // { id, price }

  const handleOrderCreated = (orderId, price) => {
    setCreatedOrder({ id: orderId, price });
    setOrderStep("payment");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <LandingNavbar user={user} onLogout={logout} />
      <main className="flex-1 px-4 py-12 max-w-2xl mx-auto animate-fade-in">
        {orderStep === "form" && (
          <div className="w-full max-w-2xl mx-auto mt-8 mb-16 animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 p-6 sm:p-10 relative">
              <button
                className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
                aria-label="Close order form"
                onClick={() => navigate(-1)}
              >
                &times;
              </button>
              {/* Only render the heading here, not inside CreateOrder */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-6 text-center">Create Your Order</h2>
              <CreateOrder
                multiStep
                onClose={() => navigate(-1)}
                initialSelections={initialSelections}
                onOrderCreated={handleOrderCreated}
                hideTitle // Pass a prop to suppress the title inside CreateOrder
              />
            </div>
          </div>
        )}
        {orderStep === "payment" && createdOrder && (
          <div className="w-full max-w-2xl mx-auto mt-8 mb-16 animate-fade-in-up">
            <PayWithPayPal
              orderId={createdOrder.id}
              amount={createdOrder.price}
              onSuccess={() => {
                setOrderStep("done");
              }}
              onCancel={() => {
                setOrderStep("form");
              }}
            />
          </div>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}
