import React, { useState, useEffect } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import CreateOrder from "../features/orders/CreateOrder";
import PayWithPayPal from "../features/orders/PayWithPayPal";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";

export default function NewOrderPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Get initial selections from navigation state (if any)
  const initialSelections = location.state?.calculatorSelections || null;
  const [orderStep, setOrderStep] = useState("form"); // "form" | "payment"
  const [createdOrder, setCreatedOrder] = useState(null); // { id, price }
  const [step, setStep] = useState(1); // 1, 2, 3
  const [form, setForm] = useState({
    title: "",
    preferred_writer_number: "",
    order_type_id: "",
    order_level_id: "",
    order_pages_id: "",
    order_urgency_id: "",
    description: "",
    file: null,
    order_style_id: "",
    no_of_sources: 1,
    simple_language: false,
    sms_updates: false,
    copy_of_sources: false,
    plagiarism_report: false,
    top_writer: false,
    title_page: true,
    bibliography: true,
    outline: true,
  });

  // Options for dropdowns
  const [options, setOptions] = useState({
    orderTypes: [],
    levels: [],
    pages: [],
    urgency: [],
    styles: [],
    languages: [],
  });
  // Fetch dropdown options on mount
  useEffect(() => {
    async function fetchOptions(endpoint) {
      const jwt = localStorage.getItem("jwt_token");
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api${endpoint}`, {
        headers: { "Authorization": jwt ? `Bearer ${jwt}` : "" }
      });
      const data = await res.json();
      return data?.items || data || [];
    }
    (async () => {
      const [orderTypesRaw, levels, pages, urgency, styles, languages] = await Promise.all([
        fetchOptions("/order-types/all"),
        fetchOptions("/order-levels"),
        fetchOptions("/order-pages"),
        fetchOptions("/order-urgency"),
        fetchOptions("/order-styles"),
        fetchOptions("/order-languages")
      ]);
      const orderTypes = Array.isArray(orderTypesRaw?.order_types) ? orderTypesRaw.order_types : (Array.isArray(orderTypesRaw) ? orderTypesRaw : []);
      setOptions({ orderTypes, levels, pages, urgency, styles, languages });
    })();
  }, []);

  // Calculate price (same as OrderPriceCalculator)
  const selectedType = options.orderTypes.find(o => o.id === form.order_type_id);
  const selectedUrgency = options.urgency.find(o => o.id === form.order_urgency_id);
  const selectedLevel = options.levels.find(o => o.id === form.order_level_id);
  const selectedPages = options.pages.find(o => o.id === form.order_pages_id);
  const price = selectedType && selectedUrgency && selectedLevel && selectedPages
    ? (selectedType.base_price_per_page * selectedUrgency.urgency_price_multiplier * selectedLevel.level_price_multiplier * selectedPages.number_of_pages).toFixed(2)
    : "-";

  // Real summary data
  const summary = {
    typeOfWork: selectedType ? selectedType.name : "-",
    academicLevel: selectedLevel ? selectedLevel.name : "-",
    pageCount: selectedPages ? `${selectedPages.number_of_pages} pages / ${selectedPages.number_of_pages * 275} words` : "-",
    deadline: selectedUrgency ? `${selectedUrgency.name} / ${selectedUrgency.deadline_date || '-'} ` : "-",
    simpleLanguage: form.simple_language ? "$0.00" : "Free",
    smsUpdates: form.sms_updates ? "$1.99" : "Free",
    copyOfSources: form.copy_of_sources ? "$3.68" : "Free",
    plagiarismReport: form.plagiarism_report ? "$14.99" : "Free",
    topWriter: form.top_writer ? "$7.38" : "Free",
    titlePage: form.title_page ? "Free" : "$0.00",
    bibliography: form.bibliography ? "Free" : "$0.00",
    outline: form.outline ? "Free" : "$0.00",
    total: price !== "-" ? `$${price}` : "-"
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <LandingNavbar user={user} onLogout={logout} />
      <main className="flex-1 px-4 py-12 w-[80vw] max-w-7xl mx-auto animate-fade-in">
        {orderStep === "form" && (
          <div className="w-full flex flex-row gap-10 mx-auto mt-8 mb-16 animate-fade-in-up">
            {/* Left column: 70% */}
            <div className="flex-1 min-w-0 max-w-[70%] bg-white rounded-2xl shadow-2xl border border-blue-200 p-6 sm:p-10 relative flex flex-col">
              <button
                className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
                aria-label="Close order form"
                onClick={() => navigate(-1)}
              >
                &times;
              </button>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-6 text-center">Create Your Order</h2>
              {/* Stepper UI */}
              <div className="flex justify-center mb-8">
                <div className="flex gap-4">
                  {[1,2,3].map(n => (
                    <div key={n} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg border-2 ${step===n?'bg-blue-700 text-white border-blue-700':'bg-white text-blue-700 border-blue-300'}`}>{n}</div>
                  ))}
                </div>
              </div>
              {/* Step 1 */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <input className="input" placeholder="Order Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
                  <input className="input" placeholder="Preferred Writer Number" value={form.preferred_writer_number} onChange={e=>setForm(f=>({...f,preferred_writer_number:e.target.value}))} />
                  <select className="input" value={form.order_type_id} onChange={e=>setForm(f=>({...f,order_type_id:e.target.value}))}>
                    <option value="">Select Order Type</option>
                    {options.orderTypes.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select className="input" value={form.order_level_id} onChange={e=>setForm(f=>({...f,order_level_id:e.target.value}))}>
                    <option value="">Select Order Level</option>
                    {options.levels.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select className="input" value={form.order_pages_id} onChange={e=>setForm(f=>({...f,order_pages_id:e.target.value}))}>
                    <option value="">Select Page Count</option>
                    {options.pages.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <select className="input" value={form.order_urgency_id} onChange={e=>setForm(f=>({...f,order_urgency_id:e.target.value}))}>
                    <option value="">Select Urgency</option>
                    {options.urgency.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <button className="btn-primary mt-4" onClick={()=>setStep(2)}>Next</button>
                </div>
              )}
              {/* Step 2 */}
              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <textarea className="input" placeholder="Order Description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
                  <input className="input" type="file" onChange={e=>setForm(f=>({...f,file:e.target.files[0]}))} />
                  <select className="input" value={form.order_style_id} onChange={e=>setForm(f=>({...f,order_style_id:e.target.value}))}>
                    <option value="">Select Order Style</option>
                    {options.styles.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <input className="input" placeholder="Number of Sources" type="number" min={1} value={form.no_of_sources} onChange={e=>setForm(f=>({...f,no_of_sources:e.target.value}))} />
                  <div className="flex gap-4 mt-4">
                    <button className="btn-secondary" onClick={()=>setStep(1)}><span className="mr-2">&#8592;</span>Go Back</button>
                    <button className="btn-primary" onClick={()=>setStep(3)}>Next</button>
                  </div>
                </div>
              )}
              {/* Step 3 */}
              {step === 3 && (
                <div className="flex flex-col gap-6">
                  {/* Render all other fields here as needed */}
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.simple_language} onChange={e=>setForm(f=>({...f,simple_language:e.target.checked}))}/> Simple language</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.sms_updates} onChange={e=>setForm(f=>({...f,sms_updates:e.target.checked}))}/> SMS Updates</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.copy_of_sources} onChange={e=>setForm(f=>({...f,copy_of_sources:e.target.checked}))}/> Copy of sources</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.plagiarism_report} onChange={e=>setForm(f=>({...f,plagiarism_report:e.target.checked}))}/> Plagiarism report</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.top_writer} onChange={e=>setForm(f=>({...f,top_writer:e.target.checked}))}/> TOP Writer</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.title_page} onChange={e=>setForm(f=>({...f,title_page:e.target.checked}))}/> Title page</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.bibliography} onChange={e=>setForm(f=>({...f,bibliography:e.target.checked}))}/> Bibliography</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={form.outline} onChange={e=>setForm(f=>({...f,outline:e.target.checked}))}/> Outline</label>
                  <div className="flex gap-4 mt-4">
                    <button className="btn-secondary" onClick={()=>setStep(2)}><span className="mr-2">&#8592;</span>Go Back</button>
                    <button className="btn-primary" onClick={()=>{/* handle submit here */}}>Checkout</button>
                  </div>
                </div>
              )}
              {/* Go back icon at bottom left */}
              <button className="absolute left-4 bottom-4 flex items-center text-blue-500 hover:text-blue-700" onClick={()=>step>1?setStep(step-1):navigate(-1)}>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                Go Back
              </button>
            </div>
            {/* Right column: 30% */}
            <div className="flex flex-col justify-between max-w-[30%] min-w-[280px] bg-white rounded-2xl shadow-2xl border border-blue-200 p-6">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-900">Summary</h3>
                <ul className="text-blue-900 text-sm mb-6">
                  <li>Type of work: {summary.typeOfWork}</li>
                  <li>Academic level: {summary.academicLevel}</li>
                  <li>Page count: {summary.pageCount}</li>
                  <li>Deadline: {summary.deadline}</li>
                  <li>Simple language: {summary.simpleLanguage}</li>
                  <li>SMS Updates: {summary.smsUpdates}</li>
                  <li>Copy of sources: {summary.copyOfSources}</li>
                  <li>Plagiarism report: {summary.plagiarismReport}</li>
                  <li>TOP Writer: {summary.topWriter}</li>
                  <li>Title page: {summary.titlePage}</li>
                  <li>Bibliography: {summary.bibliography}</li>
                  <li>Outline: {summary.outline}</li>
                </ul>
                <div className="text-lg font-bold text-blue-900 mb-4">Total: USD {summary.total}</div>
                <div className="mb-4">
                  <div className="font-semibold text-blue-800 mb-1">Alternative payment option</div>
                  <div className="flex items-center gap-2 mb-2">
                    <input type="radio" id="card" name="payment" defaultChecked />
                    <label htmlFor="card" className="text-blue-900">Credit/debit card</label>
                  </div>
                  <div className="text-xs text-blue-500">We keep your information and payment data safe</div>
                </div>
              </div>
              <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-700 text-lg">Checkout</button>
            </div>
          </div>
        )}
        {orderStep === "payment" && createdOrder && (
          <div className="w-full max-w-3xl mx-auto mt-8 mb-16 animate-fade-in-up">
            <PayWithPayPal
              orderId={createdOrder.id}
              amount={createdOrder.price}
              onSuccess={() => {
                setOrderStep("done");
              }}
              onCancel={() => {
                setOrderStep("form");
              }}
            />
          </div>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}
