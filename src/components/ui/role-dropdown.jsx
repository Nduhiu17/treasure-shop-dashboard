import React, { useState, useEffect, useRef } from "react";
import { useToast } from "./toast";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function RoleDropdown({ userId, onAssign }) {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/api/admin/roles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt_token") ? `Bearer ${localStorage.getItem("jwt_token")}` : ""
      }
    })
      .then(res => res.json())
      .then(data => setRoles(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen(o => !o)}
      >
        Assign a Role
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-44 bg-white border border-blue-200 rounded-xl shadow-2xl z-50 py-1 animate-fade-in-down">
          {loading ? (
            <li className="px-4 py-2 text-blue-700 text-sm">Loading...</li>
          ) : roles.length === 0 ? (
            <li className="px-4 py-2 text-gray-400 text-sm">No roles found</li>
          ) : (
            roles.map(role => (
              <li key={role.id} className="flex items-center justify-between group">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-900 text-sm font-medium"
                  onClick={() => { setOpen(false); onAssign(role); }}
                >
                  {role.name}
                </button>
                <button
                  className="ml-2 p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-700 focus:outline-none opacity-70 group-hover:opacity-100 transition"
                  title="Delete role"
                  onClick={async (e) => {
                    e.stopPropagation();
                    let confirmed = window.confirm(`Are you sure you want to delete the role '${role.name}'? This cannot be undone.`);
                    if (!confirmed) return;
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/admin/roles/${role.id}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: localStorage.getItem("jwt_token") ? `Bearer ${localStorage.getItem("jwt_token")}` : ""
                        }
                      });
                      if (!res.ok) throw new Error("Failed to delete role");
                      showToast({ type: "success", message: `Role '${role.name}' deleted successfully` });
                      // Refresh roles
                      setRoles(roles => roles.filter(r => r.id !== role.id));
                    } catch (err) {
                      showToast({ type: "error", message: err.message || "Failed to delete role" });
                    }
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
