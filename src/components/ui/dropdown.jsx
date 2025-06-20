import React, { useState, useRef, useEffect } from "react";

export default function Dropdown({ label, options, onSelect, disabledOptions = [], className = "", buttonClass = "", children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        className={`flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold shadow border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${buttonClass}`}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border border-blue-200 rounded-xl shadow-2xl z-50 py-1 animate-fade-in-down">
          {options.filter(opt => !disabledOptions.includes(opt.value)).map((opt) => (
            <li key={opt.value}>
              <button
                className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-900 text-sm font-medium"
                onClick={() => { setOpen(false); onSelect(opt.value); }}
              >
                {opt.label}
              </button>
            </li>
          ))}
          {children}
        </ul>
      )}
    </div>
  );
}
