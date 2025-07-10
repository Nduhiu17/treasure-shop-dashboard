import React from "react";
import OrderDetailsPanel from "./OrderDetailsPanel";

export default function OrderDetailsPanelModal({ order, submissions, reviews, submissionsLoading, reviewsLoading, isOpen, onClose }) {
  if (!isOpen || !order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
      <div className="w-full max-w-2xl mx-auto">
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
