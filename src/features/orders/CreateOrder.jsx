import React, { useEffect, useState, useRef } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Loader from "../../components/ui/Loader";

const API_BASE = "http://localhost:8080/api";
const PAY_API = "http://localhost:8080/orders/pay";

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

function PaySection({ orderId, amount, onSuccess }) {
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const paypalRef = useRef();

  useEffect(() => {
    let script;
    const paypalNode = paypalRef.current;
    function renderPayPal() {
      if (!paypalNode) return;
      paypalNode.innerHTML = "";
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: (data, actions) => actions.order.create({
            purchase_units: [{ amount: { value: amount.toFixed(2) } }],
          }),
          onApprove: async (data, actions) => {
            setPaying(true);
            try {
              await actions.order.capture();
              await fetch(PAY_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, method: "paypal", status: "success" })
              });
              onSuccess();
            } catch (e) {
              setError("Payment failed. Please try again.");
            } finally {
              setPaying(false);
            }
          },
          onError: () => setError("PayPal payment failed. Try again."),
        }).render(paypalNode);
      }
    }
    if (!window.paypal) {
      script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=USD";
      script.async = true;
      script.onload = renderPayPal;
      script.onerror = () => setError("Failed to load PayPal. Try again later.");
      document.body.appendChild(script);
    } else {
      renderPayPal();
    }
    return () => {
      if (paypalNode) paypalNode.innerHTML = "";
      if (script) script.remove();
    };
    // eslint-disable-next-line
  }, [orderId, amount]);

  // Demo MasterCard (Stripe/etc) logic
  const handleMasterCard = async () => {
    setPaying(true);
    setError("");
    setTimeout(async () => {
      try {
        await fetch(PAY_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, method: "mastercard", status: "success" })
        });
        onSuccess();
      } catch {
        setError("MasterCard payment failed. Try again.");
      } finally {
        setPaying(false);
      }
    }, 1500);
  };

  return (
    <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200 text-center">
      <h3 className="text-xl font-bold text-blue-900 mb-4">Pay for Your Order</h3>
      <div className="mb-4 text-lg text-blue-800">Amount: <span className="font-bold">${amount.toFixed(2)}</span> USD</div>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <div ref={paypalRef} className="w-56" />
        <Button
          onClick={handleMasterCard}
          disabled={paying}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold px-6 py-3 rounded-xl shadow hover:from-yellow-600 hover:to-yellow-700"
        >
          Pay with MasterCard
        </Button>
      </div>
      {paying && <div className="mt-4 text-blue-600">Processing payment...</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}

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
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [showPay, setShowPay] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [orderTypesRaw, levels, pages, urgency, styles, languages] = await Promise.all([
          fetchOptions("/order-types/all"),
          fetchOptions("/order-levels"),
          fetchOptions("/order-pages"),
          fetchOptions("/order-urgency"),
          fetchOptions("/order-styles"),
          fetchOptions("/order-languages")
        ]);
        // orderTypesRaw may be an object with 'order_types' property
        const orderTypes = Array.isArray(orderTypesRaw?.order_types) ? orderTypesRaw.order_types : (Array.isArray(orderTypesRaw) ? orderTypesRaw : []);
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileUploadError("");
    setUploadedFileUrl("");
    setFileUploadProgress(0);
  };

  const uploadFile = async (selectedFile) => {
    return new Promise((resolve, reject) => {
      setFileUploadLoading(true);
      setFileUploadProgress(0);
      const jwt = localStorage.getItem("jwt_token");
      const formData = new FormData();
      formData.append("file", selectedFile);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${API_BASE}/upload`);
      if (jwt) xhr.setRequestHeader("Authorization", `Bearer ${jwt}`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setFileUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        setFileUploadLoading(false);
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setUploadedFileUrl(res.url);
          resolve(res.url);
        } else {
          setFileUploadError("Failed to upload file");
          reject("Failed to upload file");
        }
      };
      xhr.onerror = () => {
        setFileUploadLoading(false);
        setFileUploadError("Failed to upload file");
        reject("Failed to upload file");
      };
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    let fileUrl = uploadedFileUrl;
    if (file && !uploadedFileUrl) {
      try {
        fileUrl = await uploadFile(file);
      } catch {
        setError("File upload failed. Please try again.");
        return;
      }
    }
    if (file && !fileUrl) {
      setError("Please wait for the file to finish uploading.");
      return;
    }
    setLoading(true);
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
          no_of_sources: Number(form.no_of_sources),
          ...(fileUrl ? { original_order_file: fileUrl } : {})
        })
      });
      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();
      setOrderId(data.id || data.orderId || data._id);
      setShowPay(true);
      setSuccess("");
      setForm((f) => ({ ...f, title: "", description: "", preferred_writer_number: "" }));
      setFile(null);
      setUploadedFileUrl("");
      setFileUploadProgress(0);
    } catch (e) {
      setError(e.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  // Custom Select with enhanced design and focus/active state
  const CustomSelect = ({ label, name, value, options, onChange }) => (
    <div className="mb-4 w-full">
      <label className="block text-blue-900 font-semibold mb-1">{label}</label>
      <div className="relative group">
        <select
          name={name}
          value={value}
          onChange={e => onChange(name, e.target.value)}
          className={
            `w-full px-4 py-2 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium appearance-none pr-12 transition-all duration-150 shadow-sm
            group-focus-within:border-blue-600 group-focus-within:ring-2 group-focus-within:ring-blue-300
            ${value ? 'ring-2 ring-blue-400 border-blue-400' : ''}`
          }
          style={{ boxShadow: value ? '0 0 0 2px #3b82f6' : undefined }}
        >
          <option value="">Select {label}</option>
          {(Array.isArray(options) ? options : []).map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
        {/* Animated chevron icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-600 transition-colors duration-150">
          <svg className={`w-5 h-5 transition-transform duration-200 ${value ? 'rotate-180 text-blue-600' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        {/* Checkmark for selected */}
        {value && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-600 animate-fade-in">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-[60vh] bg-transparent py-2 px-0">
      <Card className="w-full max-w-3xl md:max-w-4xl lg:max-w-5xl p-2 sm:p-6 md:p-10 shadow-2xl border-0 bg-white/95 rounded-3xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-6 text-center tracking-tight">Create New Order</h2>
        {showPay && orderId && !paid ? (
          <PaySection orderId={orderId} amount={form.price} onSuccess={() => setPaid(true)} />
        ) : paid ? (
          <div className="text-green-700 text-xl font-bold text-center my-12">Payment successful! Thank you for your order.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
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
                <label className="block text-blue-900 font-semibold mb-1">Preferred Writer Number</label>
                <input
                  type="text"
                  name="preferred_writer_number"
                  value={form.preferred_writer_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium"
                  placeholder="e.g. 123456"
                />
                <label className="block text-blue-900 font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium"
                  placeholder="Describe your order..."
                />
                <div className="mb-4 w-full">
                  <label className="block text-blue-900 font-semibold mb-1">Number of Sources</label>
                  <div className="relative">
                    <select
                      name="no_of_sources"
                      value={form.no_of_sources}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-blue-200 bg-white text-blue-900 font-medium appearance-none pr-12 transition-all duration-150 shadow-sm focus:ring-4 focus:ring-blue-200 focus:border-blue-400 outline-none"
                    >
                      {[...Array(30)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </div>
                </div>
                {/* File upload section */}
                <div className="mb-4 w-full">
                  <label className="block text-blue-900 font-semibold mb-1 flex items-center gap-2">
                    <span>Upload File</span>
                    <span className="text-xs text-blue-400 font-normal">(optional, .docx/.pdf/.txt)</span>
                  </label>
                  <div className="relative flex items-center gap-2">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-blue-900 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all duration-150"
                      accept=".doc,.docx,.pdf,.txt"
                    />
                    {fileUploadLoading && (
                      <Loader className="w-5 h-5 text-blue-600 animate-spin absolute right-2 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {file && (
                    <div className="mt-2 text-sm text-blue-700 flex flex-col gap-1">
                      <span className="truncate">{file.name} <span className="text-xs text-blue-400">({Math.round(file.size / 1024)} KB)</span></span>
                      {fileUploadLoading && (
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-200 rounded-full h-2.5 w-40 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${fileUploadProgress}%` }}
                            />
                          </div>
                          <span className="text-xs text-blue-600 font-semibold">{fileUploadProgress}%</span>
                        </div>
                      )}
                      {uploadedFileUrl && !fileUploadLoading && (
                        <div className="text-green-600 text-xs flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          File uploaded successfully!
                        </div>
                      )}
                      {fileUploadError && (
                        <div className="text-red-600 text-xs">{fileUploadError}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 shadow-sm">
                  <h3 className="text-blue-800 font-semibold text-base mb-2">Order Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CustomSelect label="Order Type" name="order_type_id" value={form.order_type_id} options={options.orderTypes} onChange={handleSelect} />
                    <CustomSelect label="Level" name="order_level_id" value={form.order_level_id} options={options.levels} onChange={handleSelect} />
                    <CustomSelect label="Pages" name="order_pages_id" value={form.order_pages_id} options={options.pages} onChange={handleSelect} />
                    <CustomSelect label="Urgency" name="order_urgency_id" value={form.order_urgency_id} options={options.urgency} onChange={handleSelect} />
                    <CustomSelect label="Style" name="order_style_id" value={form.order_style_id} options={options.styles} onChange={handleSelect} />
                    <CustomSelect label="Language" name="order_language_id" value={form.order_language_id} options={options.languages} onChange={handleSelect} />
                  </div>
                  {/* Boolean fields on their own full-width row */}
                  <div className="w-full flex flex-row flex-wrap gap-2 mt-4 justify-center bg-blue-100/60 rounded-xl p-2">
                    {booleanFields.map(field => (
                      <label key={field.key} className="flex-1 min-w-[120px] max-w-xs flex items-center gap-2 bg-white/80 rounded-lg px-2 py-1 shadow border border-blue-100 cursor-pointer text-xs justify-center m-1">
                        <input
                          type="checkbox"
                          name={field.key}
                          checked={form[field.key]}
                          onChange={handleChange}
                          className="accent-blue-600 w-5 h-5"
                        />
                        <span className="text-blue-900 font-medium text-xs">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-6 gap-4">
              <Button
                type="button"
                onClick={() => setForm({
                  title: "",
                  description: "",
                  price: 37.90,
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
                })}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-150"
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition-all duration-150 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Order"
                )}
              </Button>
            </div>
            {success && (
              <div className="mt-4 text-green-600 text-center text-sm font-semibold">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-4 text-red-600 text-center text-sm font-semibold">
                {error}
              </div>
            )}
          </form>
        )}
      </Card>
    </div>
  );
};

export default CreateOrder;
