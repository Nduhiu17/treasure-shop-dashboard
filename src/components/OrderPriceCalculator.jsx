import React, { useEffect, useState } from "react";

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

  // Compact dropdown
  const dropdown = (options, value, setValue, key, getLabel) => (
    <select
      className="w-full px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
      value={value?.id || ""}
      onChange={e => setValue(options.find(o => o.id === e.target.value))}
      style={{ minHeight: 36 }}
    >
      {options.map(o => (
        <option key={o.id} value={o.id}>{getLabel(o)}</option>
      ))}
    </select>
  );

  return (
    <div
      className="w-full max-w-xs mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100 rounded-2xl shadow-xl p-4 flex flex-col gap-2 items-stretch"
      style={{ minWidth: 0 }}
    >
      <div className="text-center text-lg font-bold text-blue-800 mb-1 tracking-tight">Estimate Your Price</div>
      {dropdown(orderTypes, selectedType, setSelectedType, "type", o => o.name)}
      {dropdown(levels, selectedLevel, setSelectedLevel, "level", o => o.name)}
      {dropdown(urgencies, selectedUrgency, setSelectedUrgency, "urgency", o => o.name)}
      {dropdown(pagesOptions, selectedPages, setSelectedPages, "pages", o => o.name)}
      <div className="flex items-center justify-between mt-2">
        <div className="text-blue-700 font-semibold text-base">
          ${price}
        </div>
        <button
          className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 text-sm"
          onClick={() => onProceed && onProceed({
            order_type: selectedType,
            urgency: selectedUrgency,
            level: selectedLevel,
            pages: selectedPages,
            price,
          })}
          disabled={!selectedType || !selectedUrgency || !selectedLevel || !selectedPages}
        >
          Proceed to details
        </button>
      </div>
    </div>
  );
}
