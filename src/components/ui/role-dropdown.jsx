import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function RoleDropdown({ userId, onAssign }) {
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
              <li key={role.id}>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-900 text-sm font-medium"
                  onClick={() => { setOpen(false); onAssign(role); }}
                >
                  {role.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
