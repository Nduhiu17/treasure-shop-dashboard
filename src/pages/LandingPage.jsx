import React, { useState } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Button } from "../components/ui/button";
import { useAuth } from "../features/auth/AuthProvider";
import LoginPage from "../features/auth/LoginPage";
import { Dialog } from "../components/ui/dialog";
import { WideDialog } from "../components/ui/wide-dialog";
import CreateOrder from "../features/orders/CreateOrder";
import PayPalModal from "../features/orders/PayPalModal";

export default function LandingPage({ user, onLogout }) {
  const { user: authUser } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(false);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [payPalModalOpen, setPayPalModalOpen] = useState(false);
  const [payPalOrderId, setPayPalOrderId] = useState(null);
  const [payPalAmount, setPayPalAmount] = useState(null);

  // Handler for all "Order" buttons
  const handleOrderClick = (e) => {
    e?.preventDefault?.();
    if (authUser) {
      setCreateOrderModalOpen(true);
    } else {
      setPendingOrder(true);
      setLoginModalOpen(true);
    }
  };

  // After successful login
  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    if (pendingOrder) {
      setPendingOrder(false);
      setCreateOrderModalOpen(true);
    }
  };

  const handleOrderCreated = (orderId, amount) => {
    setCreateOrderModalOpen(false);
    setTimeout(() => {
      setPayPalOrderId(orderId);
      setPayPalAmount(amount);
      setPayPalModalOpen(true);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <LandingNavbar user={authUser} onLogout={onLogout} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <section className="max-w-3xl text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-900 mb-4 leading-tight">
            Academic Excellence, Delivered Fast
          </h1>
          <p className="text-lg sm:text-xl text-blue-800 mb-8">
            Get top-quality academic writing, editing, and research help from expert writers. Fast, confidential, and always on time.
          </p>
          <Button
            onClick={handleOrderClick}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg rounded-xl"
          >
            Order Now
          </Button>
        </section>
        <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-blue-100">
            <svg className="w-10 h-10 text-blue-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
            <h3 className="font-bold text-blue-900 text-lg mb-2">Expert Writers</h3>
            <p className="text-blue-800 text-sm">Handpicked, degree-holding writers in every discipline. 24/7 support and direct communication.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-blue-100">
            <svg className="w-10 h-10 text-green-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <h3 className="font-bold text-blue-900 text-lg mb-2">100% Original</h3>
            <p className="text-blue-800 text-sm">Every paper is written from scratch and checked for plagiarism. Your privacy is always protected.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border border-blue-100">
            <svg className="w-10 h-10 text-yellow-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="font-bold text-blue-900 text-lg mb-2">On-Time Delivery</h3>
            <p className="text-blue-800 text-sm">Deadlines matter. We deliver on time, every time—guaranteed, or your money back.</p>
          </div>
        </section>
        <section className="w-full max-w-5xl mb-16 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-blue-100">
              <svg className="w-8 h-8 text-blue-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              <h4 className="font-bold text-blue-900 mb-1">1. Place Your Order</h4>
              <p className="text-blue-800 text-sm">Fill out our simple order form and upload your requirements.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-blue-100">
              <svg className="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
              <h4 className="font-bold text-blue-900 mb-1">2. We Assign a Writer</h4>
              <p className="text-blue-800 text-sm">We match your order with the best available expert in your field.</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-blue-100">
              <svg className="w-8 h-8 text-yellow-500 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <h4 className="font-bold text-blue-900 mb-1">3. Download & Succeed</h4>
              <p className="text-blue-800 text-sm">Receive your completed paper, review, and download. Satisfaction guaranteed!</p>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
      <Dialog isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} title="Login">
        <LoginPage asModal onSuccess={handleLoginSuccess} />
      </Dialog>
      <WideDialog isOpen={createOrderModalOpen} onClose={() => setCreateOrderModalOpen(false)} title="Create Order">
        <CreateOrder onClose={() => setCreateOrderModalOpen(false)} onOrderCreated={handleOrderCreated} />
      </WideDialog>
      <PayPalModal
        isOpen={payPalModalOpen}
        onClose={() => setPayPalModalOpen(false)}
        orderId={payPalOrderId}
        amount={payPalAmount}
        onSuccess={() => { setPayPalModalOpen(false); window.location.href = "http://localhost:3000/profile"; }}
      />
    </div>
  );
}
