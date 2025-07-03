import React, { useEffect, useState } from "react";

// Animated sparkle SVG icon
const SparkleIcon = () => (
  <svg className="inline-block animate-sparkle mr-1" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M11 2v3M11 17v3M4.22 4.22l2.12 2.12M15.66 15.66l2.12 2.12M2 11h3M17 11h3M4.22 17.78l2.12-2.12M15.66 6.34l2.12-2.12" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="11" cy="11" r="4" fill="#38bdf8" fillOpacity="0.15"/>
    </g>
  </svg>
);

// Compact, single-column, minimal-label Order Price Calculator
export default function OrderPriceCalculator({ onProceed }) {
  const [orderTypes, setOrderTypes] = useState([]);
  const [urgencies, setUrgencies] = useState([]);
  const [levels, setLevels] = useState([]);
  const [pagesOptions, setPagesOptions] = useState([]);

  const [selectedType, setSelectedType] = useState(null);
  const [selectedUrgency, setSelectedUrgency] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedPages, setSelectedPages] = useState(null);

  // Fetch all dropdown data
  useEffect(() => {
    fetch("http://localhost:8080/api/order-types/all")
      .then((r) => r.json())
      .then((data) => setOrderTypes(data.order_types || []));
    fetch("http://localhost:8080/api/order-urgency")
      .then((r) => r.json())
      .then(setUrgencies);
    fetch("http://localhost:8080/api/order-levels")
      .then((r) => r.json())
      .then(setLevels);
    fetch("http://localhost:8080/api/order-pages")
      .then((r) => r.json())
      .then(setPagesOptions);
  }, []);

  // Set defaults when data loads
  useEffect(() => {
    if (orderTypes.length && !selectedType) setSelectedType(orderTypes[0]);
  }, [orderTypes]);
  useEffect(() => {
    if (urgencies.length && !selectedUrgency) setSelectedUrgency(urgencies[0]);
  }, [urgencies]);
  useEffect(() => {
    if (levels.length && !selectedLevel) setSelectedLevel(levels[0]);
  }, [levels]);
  useEffect(() => {
    if (pagesOptions.length && !selectedPages) setSelectedPages(pagesOptions[0]);
  }, [pagesOptions]);

  // Calculate price
  const price = selectedType && selectedUrgency && selectedLevel && selectedPages
    ? (selectedType.base_price_per_page * selectedUrgency.urgency_price_multiplier * selectedLevel.level_price_multiplier * selectedPages.number_of_pages).toFixed(2)
    : "-";

  // Compact dropdown with animation
  const dropdown = (options, value, setValue, key, getLabel) => (
    <select
      className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white/80 text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 mb-3 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md hover:border-sky-300"
      value={value?.id || ""}
      onChange={e => setValue(options.find(o => o.id === e.target.value))}
      style={{ minHeight: 40 }}
    >
      {options.map(o => (
        <option key={o.id} value={o.id}>{getLabel(o)}</option>
      ))}
    </select>
  );

  return (
    <div
      className="w-full max-w-xs mx-auto bg-gradient-to-br from-sky-100 via-white to-blue-200 border border-sky-200/80 rounded-3xl shadow-2xl p-5 flex flex-col gap-3 items-stretch relative overflow-hidden animate-fadein"
      style={{ minWidth: 0 }}
    >
      {/* Animated gradient accent ring */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-sky-300/30 via-blue-200/20 to-green-200/10 rounded-full blur-2xl pointer-events-none animate-pulse-slow" />
      <div className="text-center text-xl font-extrabold text-sky-700 mb-2 tracking-tight flex items-center justify-center gap-1 select-none">
        <SparkleIcon /> Estimate Your Price
      </div>
      {dropdown(orderTypes, selectedType, setSelectedType, "type", o => o.name)}
      {dropdown(levels, selectedLevel, setSelectedLevel, "level", o => o.name)}
      {dropdown(urgencies, selectedUrgency, setSelectedUrgency, "urgency", o => o.name)}
      {dropdown(pagesOptions, selectedPages, setSelectedPages, "pages", o => o.name)}
      <div className="flex items-center justify-between mt-3 mb-1 px-1">
        <div className="text-sky-700 font-bold text-lg flex items-center gap-1 animate-fadein">
          <svg className="w-5 h-5 text-green-400 animate-bounce-slow mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          ${price}
        </div>
        <button
          className="bg-gradient-to-r from-green-400 via-green-500 to-sky-400 text-white font-bold px-5 py-2 rounded-xl shadow-lg hover:from-green-500 hover:to-sky-500 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out text-base focus:outline-none focus:ring-2 focus:ring-sky-300 animate-bounce-once"
          style={{ minWidth: 120 }}
          onClick={() => onProceed && onProceed({
            order_type: selectedType,
            urgency: selectedUrgency,
            level: selectedLevel,
            pages: selectedPages,
            price,
          })}
          disabled={!selectedType || !selectedUrgency || !selectedLevel || !selectedPages}
        >
          <span className="inline-block align-middle">Proceed to details</span>
        </button>
      </div>
    </div>
  );
}

// Animations (Tailwind CSS custom classes)
// Add these to your global CSS (e.g., index.css) if not already present:
// .animate-sparkle { animation: sparkle 1.5s infinite linear; }
// @keyframes sparkle { 0% { opacity: 0.7; transform: scale(1) rotate(0deg);} 50% { opacity: 1; transform: scale(1.15) rotate(10deg);} 100% { opacity: 0.7; transform: scale(1) rotate(0deg);} }
// .animate-bounce-slow { animation: bounce 2.2s infinite; }
// .animate-bounce-once { animation: bounce 0.7s 1; }
// .animate-fadein { animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both; }
// .animate-pulse-slow { animation: pulse 3s cubic-bezier(.4,0,.6,1) infinite; }
// @keyframes fadein { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none;} }
