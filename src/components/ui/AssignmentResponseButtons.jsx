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
        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold shadow transition-all duration-150 text-xs xs:text-sm sm:text-base"
        title="Accept Assignment"
        onClick={() => onRespond(order.id, true)}
      >
        <FaCheckCircle className="text-lg" /> Accept
      </button>
      <button
        className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold shadow transition-all duration-150 text-xs xs:text-sm sm:text-base"
        title="Reject Assignment"
        onClick={() => onRespond(order.id, false)}
      >
        <FaTimesCircle className="text-lg" /> Reject
      </button>
    </div>
  );
}
