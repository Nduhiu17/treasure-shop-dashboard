import React, { useEffect, useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Loader from "../../components/ui/Loader";

const API_BASE = "http://localhost:8080/api";

const fetchOptions = async (endpoint) => {
  const jwt = localStorage.getItem("jwt_token");
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Authorization": jwt ? `Bearer ${jwt}` : "" }
  });
  const data = await res.json();
  return data?.items || data || [];
};

const booleanFields = [
  { key: "is_high_priority", label: "High Priority" },
  { key: "top_writer", label: "Top Writer" },
  { key: "plagarism_report", label: "Plagiarism Report" },
  { key: "one_page_summary", label: "One Page Summary" },
  { key: "extra_quality_check", label: "Extra Quality Check" },
  { key: "initial_draft", label: "Initial Draft" },
  { key: "sms_update", label: "SMS Update" },
  { key: "full_text_copy_sources", label: "Full Text Copy Sources" },
  { key: "same_paper_from_another_writer", label: "Same Paper from Another Writer" }
];

const CreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 37.90, // Hardcoded for now
    order_type_id: "",
    order_level_id: "",
    order_pages_id: "",
    order_urgency_id: "",
    order_style_id: "",
    order_language_id: "",
    no_of_sources: 1,
    preferred_writer_number: "",
    is_high_priority: false,
    top_writer: false,
    plagarism_report: false,
    one_page_summary: false,
    extra_quality_check: false,
    initial_draft: false,
    sms_update: false,
    full_text_copy_sources: false,
    same_paper_from_another_writer: false
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [orderTypes, levels, pages, urgency, styles, languages] = await Promise.all([
          fetchOptions("/order-types/all"),
          fetchOptions("/order-levels"),
          fetchOptions("/order-pages"),
          fetchOptions("/order-urgency"),
          fetchOptions("/order-styles"),
          fetchOptions("/order-languages")
        ]);
        setOptions({
          orderTypes,
          levels,
          pages,
          urgency,
          styles,
          languages
        });
      } catch (e) {
        setError("Failed to load options");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSelect = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const jwt = localStorage.getItem("jwt_token");
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": jwt ? `Bearer ${jwt}` : ""
        },
        body: JSON.stringify({
          ...form,
          no_of_sources: Number(form.no_of_sources)
        })
      });
      if (!res.ok) throw new Error("Failed to create order");
      setSuccess("Order created successfully!");
      setForm((f) => ({ ...f, title: "", description: "", preferred_writer_number: "" }));
    } catch (e) {
      setError(e.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Custom Select with checkmark
  const CustomSelect = ({ label, name, value, options, onChange }) => (
    <div className="mb-4 w-full">
      <label className="block text-blue-900 font-semibold mb-1">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium appearance-none pr-10"
        >
          <option value="">Select {label}</option>
          {(Array.isArray(options) ? options : []).map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
        {value && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-2">
      <Card className="w-full max-w-2xl p-8 shadow-2xl border-0 bg-white/90 rounded-3xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-6 text-center tracking-tight">Create New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-blue-900 font-semibold mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium"
                placeholder="Order Title"
              />
            </div>
            <div className="flex-1">
              <label className="block text-blue-900 font-semibold mb-1">Preferred Writer Number</label>
              <input
                type="text"
                name="preferred_writer_number"
                value={form.preferred_writer_number}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium"
                placeholder="e.g. 123456"
              />
            </div>
          </div>
          <div>
            <label className="block text-blue-900 font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium"
              placeholder="Describe your order..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect label="Order Type" name="order_type_id" value={form.order_type_id} options={options.orderTypes} onChange={handleSelect} />
            <CustomSelect label="Level" name="order_level_id" value={form.order_level_id} options={options.levels} onChange={handleSelect} />
            <CustomSelect label="Pages" name="order_pages_id" value={form.order_pages_id} options={options.pages} onChange={handleSelect} />
            <CustomSelect label="Urgency" name="order_urgency_id" value={form.order_urgency_id} options={options.urgency} onChange={handleSelect} />
            <CustomSelect label="Style" name="order_style_id" value={form.order_style_id} options={options.styles} onChange={handleSelect} />
            <CustomSelect label="Language" name="order_language_id" value={form.order_language_id} options={options.languages} onChange={handleSelect} />
            <div className="mb-4 w-full">
              <label className="block text-blue-900 font-semibold mb-1">Number of Sources</label>
              <div className="relative">
                <select
                  name="no_of_sources"
                  value={form.no_of_sources}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium appearance-none pr-10"
                >
                  {[...Array(30)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {booleanFields.map(field => (
              <label key={field.key} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 shadow-sm border border-blue-100 cursor-pointer">
                <input
                  type="checkbox"
                  name={field.key}
                  checked={form[field.key]}
                  onChange={handleChange}
                  className="accent-blue-600 w-5 h-5"
                />
                <span className="text-blue-900 font-medium text-sm">{field.label}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between mt-6">
            <span className="text-lg font-bold text-blue-700">Price: <span className="text-blue-900">${form.price.toFixed(2)}</span></span>
            <Button type="submit" className="px-8 py-2 text-lg font-bold rounded-xl shadow bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white transition-all duration-150">
              {loading ? <Loader /> : "Create Order"}
            </Button>
          </div>
          {success && <div className="text-green-700 text-center font-semibold mt-4">{success}</div>}
          {error && <div className="text-red-600 text-center font-semibold mt-4">{error}</div>}
        </form>
      </Card>
    </div>
  );
};

export default CreateOrder;
