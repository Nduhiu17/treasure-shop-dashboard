import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function AssignmentResponseButtons({ order, user, onRespond }) {
  if (
    order.status !== "awaiting_asign_acceptance" ||
    !user?.roles?.includes("writer")
  ) {
    return null;
  }
  return (
    <div className="flex gap-2">
      <button
        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 transition-all duration-150 text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400"
        title="Accept Assignment"
        onClick={() => onRespond(order.id, true)}
      >
        <FaCheckCircle className="text-lg" /> Accept
      </button>
      <button
        className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow hover:from-red-600 hover:to-pink-600 transition-all duration-150 text-xs xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-400"
        title="Reject Assignment"
        onClick={() => onRespond(order.id, false)}
      >
        <FaTimesCircle className="text-lg" /> Reject
      </button>
    </div>
  );
}
