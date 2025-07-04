import React, { useState, useEffect } from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import CreateOrder from "../features/orders/CreateOrder";
import PayWithPayPal from "../features/orders/PayWithPayPal";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { FaUser, FaFileAlt, FaListOl, FaClock, FaLevelUpAlt, FaLanguage, FaFileUpload, FaSortNumericUp, FaCheckCircle, FaSms, FaCopy, FaShieldAlt, FaStar, FaFileSignature, FaBook, FaRegListAlt, FaChevronLeft, FaChevronRight, FaClipboardList, FaRegClock, FaRegFileAlt, FaRegUser, FaRegStar, FaRegFile, FaRegCopy, FaRegFileArchive, FaRegFileExcel, FaRegFileWord, FaRegFilePdf, FaRegFilePowerpoint, FaRegFileImage, FaRegFileAudio, FaRegFileVideo, FaRegFileCode } from "react-icons/fa";

export default function NewOrderPage() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Get initial selections from navigation state (if any)
  // Memoize initialSelections to avoid stale closure in useState
  const initialSelections = React.useMemo(() => location.state?.calculatorSelections || null, [location.state]);
  const [orderStep, setOrderStep] = useState("form"); // "form" | "payment"
  const [createdOrder, setCreatedOrder] = useState(null); // { id, price }
  const [step, setStep] = useState(1); // 1, 2, 3
  const [error, setError] = useState(""); // Error state for order creation
  // Always initialize with empty/defaults, then patch with calculator selections on mount if present
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
    order_language_id: "",
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

  // (moved up above)

  // Patch form with calculator selections after mount and after options are loaded
  // (moved below options declaration)

  // Options for dropdowns
  const [options, setOptions] = useState({
    orderTypes: [],
    levels: [],
    pages: [],
    urgency: [],
    styles: [],
    languages: [],
  });

  // Patch form with calculator selections after mount and after options are loaded
  // Only patch once per navigation (avoid overwriting user changes)
  const [hasPatchedFromCalculator, setHasPatchedFromCalculator] = useState(false);
  useEffect(() => {
    if (
      initialSelections &&
      !hasPatchedFromCalculator &&
      options.orderTypes.length > 0 &&
      options.levels.length > 0 &&
      options.pages.length > 0 &&
      options.urgency.length > 0
    ) {
      // Debug: log incoming calculator selections and dropdown options
      try {
        // eslint-disable-next-line no-console
        console.log('Calculator selections:', initialSelections);
        // eslint-disable-next-line no-console
        console.log('Dropdown options:', {
          orderTypes: options.orderTypes,
          levels: options.levels,
          pages: options.pages,
          urgency: options.urgency
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error logging debug info:', e);
      }
      setForm(f => {
        // Support both old (id-based) and new (object-based) calculatorSelections
        let order_type_id = initialSelections.order_type_id || initialSelections.order_type?.id || "";
        let order_level_id = initialSelections.order_level_id || initialSelections.level?.id || "";
        let order_pages_id = initialSelections.order_pages_id || initialSelections.pages?.id || "";
        let order_urgency_id = initialSelections.order_urgency_id || initialSelections.urgency?.id || "";
        // Only patch if the current values are still empty (user hasn't changed them)
        if (
          (!f.order_type_id || f.order_type_id === "") &&
          (!f.order_level_id || f.order_level_id === "") &&
          (!f.order_pages_id || f.order_pages_id === "") &&
          (!f.order_urgency_id || f.order_urgency_id === "")
        ) {
          return {
            ...f,
            order_type_id,
            order_level_id,
            order_pages_id,
            order_urgency_id,
            // If price is passed from calculator, set it as a string (for summary display)
            ...(initialSelections.price ? { price: initialSelections.price } : {})
          };
        }
        return f;
      });
      setHasPatchedFromCalculator(true);
    }
  }, [initialSelections, options.orderTypes, options.levels, options.pages, options.urgency, hasPatchedFromCalculator]);
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
  // Use pre-calculated price from form if present, otherwise calculate
  const price = (typeof form.price !== 'undefined' && form.price !== null && form.price !== "")
    ? form.price
    : (selectedType && selectedUrgency && selectedLevel && selectedPages
      ? (selectedType.base_price_per_page * selectedUrgency.urgency_price_multiplier * selectedLevel.level_price_multiplier * selectedPages.number_of_pages).toFixed(2)
      : "-");

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
      {/* Stepper Navigation Bar */}
      <nav className="w-full bg-white shadow-md border-b border-blue-200 z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-center px-2 sm:px-4 py-4 sm:py-6">
          {/* Stepper UI with labels in a row, centered, mobile: column */}
          <div className="flex flex-row gap-4 sm:gap-16 items-center sm:items-end justify-center w-full">
            {[1,2,3].map((n) => (
              <div key={n} className="flex flex-row items-center gap-2 sm:gap-3">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-base sm:text-lg border-2 transition-all duration-200 ${step===n?'bg-blue-700 text-white border-blue-700':'bg-white text-blue-700 border-blue-300'}`}>{n}</div>
                <span className={`text-xs font-semibold ${step===n?'text-blue-700':'text-blue-400'}`}> {
                  n === 1 ? 'Order overview' : n === 2 ? 'Instructions' : 'Checkout'
                } </span>
              </div>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-1 px-1 sm:px-4 py-6 sm:py-12 w-full max-w-7xl mx-auto animate-fade-in">
        {orderStep === "form" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row w-full">
              <div className="mt-2 mb-2 w-full sm:w-[70%]">
                <span className="block text-blue-700 text-base sm:text-lg font-semibold px-0 py-2">
                  {step === 1 && "Select your type of work and deadline"}
                  {step === 2 && "Describe your task"}
                  {step === 3 && "Finalize your order"}
                </span>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 mt-0 mb-8 sm:mb-16 animate-fade-in-up w-full">
              {/* Left column: 100% on mobile, 70% on desktop */}
              <div className="w-full lg:flex-1 min-w-0 max-w-full lg:max-w-[70%] bg-white rounded-2xl shadow-2xl border border-blue-200 p-4 sm:p-6 lg:p-10 relative flex flex-col mt-0">
                <button
                  className="absolute top-4 right-4 flex items-center gap-2 text-blue-400 hover:text-blue-700 text-lg font-bold focus:outline-none px-3 py-1 rounded-full border border-blue-100 bg-blue-50 shadow-sm transition-all duration-150 hover:bg-blue-100"
                  aria-label="Close order form"
                  onClick={() => navigate(-1)}
                >
                  <FaChevronLeft className="text-xl" /> Close
                </button>
                {/* Step 1 */}
                {step === 1 && (
                  <div className="flex flex-col gap-6">
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaFileAlt className="text-blue-400" /> Order Title</span>
                      <Input placeholder="Enter a descriptive title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} />
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaUser className="text-blue-400" /> Preferred Writer Number</span>
                      <Input placeholder="e.g. 12345 (optional)" value={form.preferred_writer_number} onChange={e=>setForm(f=>({...f,preferred_writer_number:e.target.value}))} />
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaListOl className="text-blue-400" /> Order Type</span>
                      <Select value={form.order_type_id} onChange={e=>setForm(f=>({...f,order_type_id:e.target.value}))}>
                        <option value="">Select Order Type</option>
                        {options.orderTypes.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </Select>
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaLevelUpAlt className="text-blue-400" /> Academic Level</span>
                      <Select value={form.order_level_id} onChange={e=>setForm(f=>({...f,order_level_id:e.target.value}))}>
                        <option value="">Select Order Level</option>
                        {options.levels.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </Select>
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaSortNumericUp className="text-blue-400" /> Page Count</span>
                      <Select value={form.order_pages_id} onChange={e=>setForm(f=>({...f,order_pages_id:e.target.value}))}>
                        <option value="">Select Page Count</option>
                        {options.pages.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </Select>
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaClock className="text-blue-400" /> Urgency</span>
                      <Select value={form.order_urgency_id} onChange={e=>setForm(f=>({...f,order_urgency_id:e.target.value}))}>
                        <option value="">Select Urgency</option>
                        {options.urgency.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </Select>
                    </label>
                    <div className="flex gap-4 mt-4 justify-end">
                      <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-150 py-3 text-lg rounded-xl px-8 min-w-[120px]" onClick={()=>setStep(2)}>
                        Next <FaChevronRight className="ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="flex flex-col gap-6">
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaFileAlt className="text-blue-400" /> Order Description</span>
                      <textarea className="input min-h-[120px] sm:min-h-[160px] text-base p-4 rounded-xl border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="Describe your order in detail..." value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaFileUpload className="text-blue-400" /> Attach File (optional)</span>
                      <input className="input" type="file" onChange={e=>setForm(f=>({...f,file:e.target.files[0]}))} />
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaRegFileAlt className="text-blue-400" /> Order Style</span>
                      <Select value={form.order_style_id} onChange={e=>setForm(f=>({...f,order_style_id:e.target.value}))}>
                        <option value="">Select Order Style</option>
                        {options.styles.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </Select>
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaLanguage className="text-blue-400" /> Order Language</span>
                      <Select value={form.order_language_id || ''} onChange={e=>setForm(f=>({...f,order_language_id:e.target.value}))}>
                        <option value="">Select Order Language</option>
                        {options.languages.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                      </Select>
                    </label>
                    <label className="flex flex-col gap-1 font-medium text-blue-900">
                      <span className="flex items-center gap-2"><FaSortNumericUp className="text-blue-400" /> Number of Sources</span>
                      <Input placeholder="Number of Sources" type="number" min={1} value={form.no_of_sources} onChange={e=>setForm(f=>({...f,no_of_sources:e.target.value}))} />
                    </label>
                    <div className="flex gap-4 mt-4 justify-end">
                      <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shadow hover:bg-blue-100 transition-all duration-150" onClick={()=>setStep(1)}>
                        <FaChevronLeft /> Go Back
                      </Button>
                      <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-150 py-3 text-lg rounded-xl px-8 min-w-[120px]" onClick={()=>setStep(3)}>
                        Next <FaChevronRight className="ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
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
                    <div className="flex gap-4 mt-4 justify-end">
                      <Button variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shadow hover:bg-blue-100 transition-all duration-150" onClick={()=>setStep(2)}>
                        <FaChevronLeft /> Go Back
                      </Button>
                      <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-blue-400 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-500 transition-all duration-150 py-3 text-lg rounded-xl px-8 min-w-[140px]"
                        onClick={async ()=>{
                          try {
                            const jwt = localStorage.getItem("jwt_token");
                            let fileUrl = null;
                            if (form.file) {
                              // Upload file first
                              const uploadData = new FormData();
                              uploadData.append('file', form.file);
                              // eslint-disable-next-line no-console
                              console.log('Uploading file to /api/upload:', form.file);
                              const uploadRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload`, {
                                method: 'POST',
                                headers: { 'Authorization': jwt ? `Bearer ${jwt}` : undefined },
                                body: uploadData
                              });
                              if (!uploadRes.ok) throw new Error('File upload failed');
                              const uploadJson = await uploadRes.json();
                              fileUrl = uploadJson.url || uploadJson.fileUrl || uploadJson.path || null;
                              if (!fileUrl) throw new Error('No file URL returned from upload');
                            }
                            // Build order payload
                            const payload = { ...form };
                            if (!payload.price && price !== "-") payload.price = Number(price);
                            if (payload.price && typeof payload.price === 'string') payload.price = Number(payload.price);
                            if (fileUrl) {
                              payload.file = fileUrl;
                            } else {
                              delete payload.file;
                            }
                            // eslint-disable-next-line no-console
                            console.log('Order payload to /api/orders (JSON):', payload);
                            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': jwt ? `Bearer ${jwt}` : undefined
                              },
                              body: JSON.stringify(payload)
                            });
                            if (!res.ok) throw new Error('Order creation failed');
                            const orderJson = await res.json();
                            setCreatedOrder({ id: orderJson.id || orderJson.order_id, price: orderJson.price || payload.price });
                            setStep(4);
                          } catch (err) {
                            setError(err.message || 'Order creation failed');
                          }
                        }}
                      >
                        <FaCheckCircle className="mr-1" /> Checkout
                      </Button>
                    </div>
                  </div>
                )}
                {/* Go back icon at bottom left: only show on step 1 and 3, not on step 2 */}
                {(step === 1 || step === 3) && (
                  <Button variant="secondary" className="absolute left-4 bottom-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shadow hover:bg-blue-100 transition-all duration-150" onClick={()=>step>1?setStep(step-1):navigate(-1)}>
                    <FaChevronLeft /> Go Back
                  </Button>
                )}
              </div>
              {/* Right column: 100% on mobile, 30% on desktop */}
              <div className="w-full lg:max-w-[30%] min-w-[220px] bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl shadow-2xl border border-blue-200 p-4 sm:p-6 flex flex-col justify-between mt-6 lg:mt-0" style={{ marginTop: '0' }}>
                <div>
                  <h3 className="text-xl font-extrabold mb-4 text-blue-900 flex items-center gap-2"><FaClipboardList className="text-blue-400 text-2xl" /> Order Summary</h3>
                  <ul className="text-blue-900 text-xs sm:text-sm mb-4 sm:mb-6 space-y-2">
                    <li className="flex items-center gap-2"><FaListOl className="text-blue-300" /> <span className="font-semibold">Type of work:</span> <span className="ml-auto">{summary.typeOfWork}</span></li>
                    <li className="flex items-center gap-2"><FaLevelUpAlt className="text-blue-300" /> <span className="font-semibold">Academic level:</span> <span className="ml-auto">{summary.academicLevel}</span></li>
                    <li className="flex items-center gap-2"><FaSortNumericUp className="text-blue-300" /> <span className="font-semibold">Page count:</span> <span className="ml-auto">{summary.pageCount}</span></li>
                    <li className="flex items-center gap-2"><FaRegClock className="text-blue-300" /> <span className="font-semibold">Deadline:</span> <span className="ml-auto">{summary.deadline}</span></li>
                    <li className="flex items-center gap-2"><FaFileSignature className="text-blue-300" /> <span className="font-semibold">Simple language:</span> <span className="ml-auto">{summary.simpleLanguage}</span></li>
                    <li className="flex items-center gap-2"><FaSms className="text-blue-300" /> <span className="font-semibold">SMS Updates:</span> <span className="ml-auto">{summary.smsUpdates}</span></li>
                    <li className="flex items-center gap-2"><FaCopy className="text-blue-300" /> <span className="font-semibold">Copy of sources:</span> <span className="ml-auto">{summary.copyOfSources}</span></li>
                    <li className="flex items-center gap-2"><FaShieldAlt className="text-blue-300" /> <span className="font-semibold">Plagiarism report:</span> <span className="ml-auto">{summary.plagiarismReport}</span></li>
                    <li className="flex items-center gap-2"><FaStar className="text-blue-300" /> <span className="font-semibold">TOP Writer:</span> <span className="ml-auto">{summary.topWriter}</span></li>
                    <li className="flex items-center gap-2"><FaRegFileAlt className="text-blue-300" /> <span className="font-semibold">Title page:</span> <span className="ml-auto">{summary.titlePage}</span></li>
                    <li className="flex items-center gap-2"><FaBook className="text-blue-300" /> <span className="font-semibold">Bibliography:</span> <span className="ml-auto">{summary.bibliography}</span></li>
                    <li className="flex items-center gap-2"><FaRegListAlt className="text-blue-300" /> <span className="font-semibold">Outline:</span> <span className="ml-auto">{summary.outline}</span></li>
                  </ul>
                  <div className="text-lg font-extrabold text-blue-800 mb-4 flex items-center gap-2 justify-between bg-white rounded-xl px-4 py-3 shadow border border-blue-100">
                    <span>Total:</span>
                    <span className="text-2xl">USD {summary.total}</span>
                  </div>
                </div>
                {/* PayWithPayPal: show in summary column if payment step */}
                {orderStep === "payment" && createdOrder && (
                  <div className="w-full flex flex-col items-center mt-4">
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
              </div>
            </div>
          </div>
        )}
        {/* Payment step PayWithPayPal is now in the summary column above */}
      </main>
      <LandingFooter />
    </div>
  );
}
