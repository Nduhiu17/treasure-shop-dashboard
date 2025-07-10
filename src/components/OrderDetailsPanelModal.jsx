import React from "react";
import OrderDetailsPanel from "./OrderDetailsPanel";

export default function OrderDetailsPanelModal({ order, submissions, reviews, submissionsLoading, reviewsLoading, isOpen, onClose }) {
  if (!isOpen || !order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-1 sm:px-4 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
      <div
        className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto my-4 sm:my-8 bg-white rounded-3xl shadow-2xl border-2 flex flex-col"
        style={{ minHeight: 'min(90vh, 420px)', maxHeight: '95vh', width: '100%', overflow: 'auto', boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)' }}
      >
        <OrderDetailsPanel
          order={order}
          submissions={submissions}
          reviews={reviews}
          submissionsLoading={submissionsLoading}
          reviewsLoading={reviewsLoading}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
