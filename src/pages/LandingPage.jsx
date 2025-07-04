import React, { useState, useCallback } from "react";
import LoginPage from "../features/auth/LoginPage";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Button } from "../components/ui/button";
import { useAuth } from "../features/auth/AuthProvider";

import { Dialog } from "../components/ui/dialog";

import { WideDialog } from "../components/ui/wide-dialog";

import CreateOrder from "../features/orders/CreateOrder";


import OrderPriceCalculator from "../components/OrderPriceCalculator";


import { useNavigate } from "react-router-dom";

export default function LandingPage({ user, onLogout }) {
  const { user: authUser } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(false);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [showCalculator, setShowCalculator] = useState(true);
  const [calculatorSelections, setCalculatorSelections] = useState(null);
  const navigate = useNavigate();

  // DRY: Shared handler for "Proceed to details" and "Order Now"
  const handleCalculatorProceed = useCallback((selections) => {
    if (authUser) {
      // Navigate to new order page, passing calculator selections
      navigate("/order/new", { state: { calculatorSelections: selections } });
    } else {
      setCalculatorSelections(selections);
      setPendingOrder(true);
      setLoginModalOpen(true);
    }
  }, [authUser, navigate]);

  // After successful login
  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    if (pendingOrder) {
      setPendingOrder(false);
      setCreateOrderModalOpen(true);
    }
  };

  // No PayPal modal/order flow: just close the form and show calculator again
  const handleOrderCreated = () => {
    setCreateOrderModalOpen(false);
    setShowCalculator(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-50 via-slate-50 to-cyan-100">
      <LandingNavbar user={authUser} onLogout={onLogout} />
      <main className="flex-1 flex flex-col items-center justify-center px-0 sm:px-4 py-0 sm:py-0">
        {/* HERO SECTION */}
        <section className="w-full bg-gradient-to-br from-fuchsia-100 via-white to-cyan-50 py-12 sm:py-20 px-4 flex flex-col items-center relative overflow-hidden shadow-lg border-b border-fuchsia-100 animate-fade-in">
          <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left z-10 gap-8">
            <div className="flex-[2] min-w-0 flex flex-col items-center md:items-start">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-fuchsia-700 mb-4 leading-tight drop-shadow-lg">Custom argumentative essay writing service</h1>
              <div className="text-lg sm:text-2xl text-slate-700 mb-6 max-w-2xl">Struggling with your argumentative essay? Our subject matter experts can tailor a high-quality, AI-free paper to your needs, instructions, and deadline at an affordable price.</div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center mb-6">
                <Button
                  onClick={handleCalculatorProceed}
                  className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold shadow-xl hover:from-fuchsia-600 hover:to-cyan-700 px-10 py-4 text-xl rounded-2xl border-2 border-fuchsia-400 hover:scale-105 transition-transform duration-200"
                >
                  Order Now
                </Button>
                <span className="text-cyan-600 font-semibold text-base flex items-center gap-2"><svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg> Rated 4.9/5 by 2500+ students</span>
              </div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start items-center mb-2">
                <img src="/img/sitejabber-badge.svg" alt="Sitejabber" className="h-8 grayscale hover:grayscale-0 transition duration-200" />
                <img src="/img/reviewsio-badge.svg" alt="Reviews.io" className="h-8 grayscale hover:grayscale-0 transition duration-200" />
                <img src="/img/trustpilot-badge.svg" alt="Trustpilot" className="h-8 grayscale hover:grayscale-0 transition duration-200" />
                <img src="/img/google-badge.svg" alt="Google Reviews" className="h-8 grayscale hover:grayscale-0 transition duration-200" />
              </div>
            </div>
            {/* Well-positioned OrderPriceCalculator (not sticky, not overlay) */}
            <div className="flex-[1] min-w-0 flex flex-col items-center justify-center w-full md:w-auto mt-10 md:mt-0 h-full">
              <div className="w-full h-full min-h-[420px] bg-gradient-to-br from-fuchsia-100 via-white to-cyan-100 rounded-3xl shadow-2xl border-2 border-fuchsia-200 p-0 animate-fade-in-up flex">
                <OrderPriceCalculator
                  onProceed={handleCalculatorProceed}
                  className="w-full h-full flex-1 !min-h-[420px] !rounded-3xl bg-transparent"
                />
              </div>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute left-0 top-0 w-40 h-40 bg-fuchsia-200/30 rounded-full blur-2xl -z-1" />
          <div className="absolute right-0 bottom-0 w-60 h-60 bg-cyan-200/30 rounded-full blur-2xl -z-1" />
        </section>
        {/* RATINGS SECTION */}
        <section className="w-full max-w-5xl mx-auto mt-10 mb-10 px-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center text-center border border-cyan-100">
            <div className="text-xl font-bold text-fuchsia-700 mb-4"><span className="text-cyan-600 font-extrabold">89% OF STUDENTS</span> INCREASED THEIR GPA AFTER USING OUR SERVICE</div>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex flex-col items-center">
                <img src="/img/sitejabber-badge.svg" alt="Sitejabber" className="h-8 mb-1" />
                <div className="text-cyan-900 font-semibold">Sitejabber</div>
                <div className="text-yellow-500 font-bold">4.9 <span className="text-cyan-700 font-normal">(188 reviews)</span></div>
              </div>
              <div className="flex flex-col items-center">
                <img src="/img/reviewsio-badge.svg" alt="Reviews.io" className="h-8 mb-1" />
                <div className="text-cyan-900 font-semibold">Reviews.io</div>
                <div className="text-yellow-500 font-bold">4.8 <span className="text-cyan-700 font-normal">(94 reviews)</span></div>
              </div>
              <div className="flex flex-col items-center">
                <img src="/img/trustpilot-badge.svg" alt="Trustpilot" className="h-8 mb-1" />
                <div className="text-cyan-900 font-semibold">Trustpilot</div>
                <div className="text-yellow-500 font-bold">4.8 <span className="text-cyan-700 font-normal">(20 reviews)</span></div>
              </div>
              <div className="flex flex-col items-center">
                <img src="/img/google-badge.svg" alt="Google Reviews" className="h-8 mb-1" />
                <div className="text-cyan-900 font-semibold">Google Reviews</div>
                <div className="text-yellow-500 font-bold">4.6 <span className="text-cyan-700 font-normal">(14 reviews)</span></div>
              </div>
            </div>
          </div>
        </section>
        {/* FEATURES SECTION */}
        <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-12 px-4 animate-fade-in-up">
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border border-fuchsia-100 hover:shadow-2xl transition-shadow duration-200">
            <svg className="w-12 h-12 text-fuchsia-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
            <h3 className="font-bold text-fuchsia-700 text-xl mb-2">In-depth understanding of the topic</h3>
            <p className="text-slate-700 text-base">Our writers have extensive expertise and deep knowledge across various disciplines, allowing them to craft compelling arguments on any subject. They are also proficient in researching complex theoretical concepts and presenting their findings clearly.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border border-cyan-100 hover:shadow-2xl transition-shadow duration-200">
            <svg className="w-12 h-12 text-cyan-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <h3 className="font-bold text-cyan-700 text-xl mb-2">Authoritative, up-to-date sources</h3>
            <p className="text-slate-700 text-base">We base every essay on current, credible research from scholarly articles, books, and journals found in trusted databases. Every argument is backed by solid reasoning and evidence from peer-reviewed sources.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border border-yellow-100 hover:shadow-2xl transition-shadow duration-200">
            <svg className="w-12 h-12 text-yellow-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="font-bold text-yellow-600 text-xl mb-2">Well-supported claims and impartiality</h3>
            <p className="text-slate-700 text-base">Our experts highlight both strengths and weaknesses of each argument, formulate clear counterarguments, and address them persuasively. This balanced approach ensures a well-rounded and objective essay.</p>
          </div>
        </section>
        {/* HOW IT WORKS SECTION */}
        {/* GUARANTEES SECTION */}
        <section className="w-full max-w-6xl px-4 mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-700 mb-10 text-center tracking-tight">Our Guarantees</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-fuchsia-200 hover:shadow-2xl transition-shadow duration-200">
              <svg className="w-12 h-12 text-fuchsia-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              <h4 className="font-bold text-fuchsia-700 text-lg mb-2">100% Originality</h4>
              <p className="text-slate-700 text-base">Every essay is written from scratch and checked with advanced plagiarism detectors. You get a unique, AI-free paper tailored to your requirements.</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-fuchsia-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-cyan-200 hover:shadow-2xl transition-shadow duration-200">
              <svg className="w-12 h-12 text-cyan-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
              <h4 className="font-bold text-cyan-700 text-lg mb-2">On-Time Delivery</h4>
              <p className="text-slate-700 text-base">We always meet your deadline, no matter how urgent. 97% of orders are delivered before the due date.</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-yellow-200 hover:shadow-2xl transition-shadow duration-200">
              <svg className="w-12 h-12 text-yellow-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h4 className="font-bold text-yellow-600 text-lg mb-2">Money-Back Guarantee</h4>
              <p className="text-slate-700 text-base">If you’re not satisfied with the result, you can request a free revision or a full refund according to our policy.</p>
            </div>
            <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-fuchsia-200 hover:shadow-2xl transition-shadow duration-200">
              <svg className="w-12 h-12 text-rose-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 8v8m8-8a8 8 0 11-16 0 8 8 0 0116 0z" /></svg>
              <h4 className="font-bold text-rose-600 text-lg mb-2">Confidentiality</h4>
              <p className="text-slate-700 text-base">Your privacy is our top priority. All communications and transactions are strictly confidential and protected by advanced security measures.</p>
            </div>
          </div>
        </section>
        {/* UNIVERSITIES SECTION */}
        <section className="w-full max-w-6xl px-4 mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-700 mb-10 text-center tracking-tight">Trusted by Students from Top Universities</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img src="/img/universities/harvard.svg" alt="Harvard" className="h-10 grayscale hover:grayscale-0 transition duration-200" />
            <img src="/img/universities/oxford.svg" alt="Oxford" className="h-10 grayscale hover:grayscale-0 transition duration-200" />
            <img src="/img/universities/mit.svg" alt="MIT" className="h-10 grayscale hover:grayscale-0 transition duration-200" />
            <img src="/img/universities/stanford.svg" alt="Stanford" className="h-10 grayscale hover:grayscale-0 transition duration-200" />
            <img src="/img/universities/cambridge.svg" alt="Cambridge" className="h-10 grayscale hover:grayscale-0 transition duration-200" />
            <img src="/img/universities/berkeley.svg" alt="Berkeley" className="h-10 grayscale hover:grayscale-0 transition duration-200" />
            <img src="/img/universities/columbia.svg" alt="Columbia" className="h-10 grayscale hover:grayscale-0 transition duration-200" />
            <img src="/img/universities/toronto.svg" alt="Toronto" className="h-10 grayscale hover:grayscale-0 transition duration-200" />
          </div>
        </section>
        {/* WRITERS SECTION */}
        <section className="w-full max-w-6xl px-4 mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-700 mb-10 text-center tracking-tight">Meet Some of Our Top Writers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-fuchsia-200 hover:shadow-2xl transition-shadow duration-200">
              <img src="/img/writers/writer1.jpg" alt="Writer 1" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-fuchsia-200" />
              <h4 className="font-bold text-fuchsia-700 text-lg mb-1">Dr. Emily Carter</h4>
              <div className="text-cyan-700 text-sm mb-2">PhD in Political Science, 8+ years experience</div>
              <p className="text-slate-700 text-base">Specializes in argumentative essays, research papers, and policy analysis. Rated 4.9/5 by 320 students.</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-fuchsia-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-cyan-200 hover:shadow-2xl transition-shadow duration-200">
              <img src="/img/writers/writer2.jpg" alt="Writer 2" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-cyan-200" />
              <h4 className="font-bold text-cyan-700 text-lg mb-1">Prof. Michael Lee</h4>
              <div className="text-fuchsia-700 text-sm mb-2">MA in Philosophy, 10+ years experience</div>
              <p className="text-slate-700 text-base">Expert in logic, ethics, and persuasive writing. Rated 4.8/5 by 280 students.</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-yellow-200 hover:shadow-2xl transition-shadow duration-200">
              <img src="/img/writers/writer3.jpg" alt="Writer 3" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-yellow-200" />
              <h4 className="font-bold text-yellow-600 text-lg mb-1">Sarah Johnson</h4>
              <div className="text-cyan-700 text-sm mb-2">MSc in Sociology, 6+ years experience</div>
              <p className="text-slate-700 text-base">Focuses on social sciences, argumentative essays, and case studies. Rated 4.9/5 by 210 students.</p>
            </div>
          </div>
        </section>
        {/* TESTIMONIALS SECTION */}
        <section className="w-full max-w-6xl px-4 mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-700 mb-10 text-center tracking-tight">What Students Say About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-fuchsia-200 hover:shadow-2xl transition-shadow duration-200">
              <svg className="w-10 h-10 text-yellow-400 mb-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
              <div className="text-fuchsia-700 font-bold mb-2">“I got an A on my argumentative essay! The writer followed all my instructions and delivered before the deadline.”</div>
              <div className="text-cyan-700 text-sm mt-2">— Jessica, NYU</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-fuchsia-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-cyan-200 hover:shadow-2xl transition-shadow duration-200">
              <svg className="w-10 h-10 text-yellow-400 mb-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
              <div className="text-cyan-700 font-bold mb-2">“Super fast and reliable service. I was able to submit my paper on time and got great feedback from my professor.”</div>
              <div className="text-fuchsia-700 text-sm mt-2">— Daniel, UCLA</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-yellow-200 hover:shadow-2xl transition-shadow duration-200">
              <svg className="w-10 h-10 text-yellow-400 mb-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
              <div className="text-yellow-600 font-bold mb-2">“The support team was very helpful and the writer was a true expert in my subject.”</div>
              <div className="text-cyan-700 text-sm mt-2">— Priya, University of Toronto</div>
            </div>
          </div>
        </section>
        {/* FAQ SECTION */}
        <section className="w-full max-w-4xl px-4 mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-700 mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-fuchsia-200">
              <h4 className="font-bold text-fuchsia-700 text-lg mb-2">Is your argumentative essay writing service confidential?</h4>
              <p className="text-slate-700 text-base">Absolutely. We guarantee complete confidentiality for all customers. Your personal information and order details are never shared with third parties.</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-fuchsia-50 rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
              <h4 className="font-bold text-cyan-700 text-lg mb-2">Will my essay be original and AI-free?</h4>
              <p className="text-slate-700 text-base">Yes. Every paper is written from scratch by a human expert and checked for both plagiarism and AI-generated content.</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-600 text-lg mb-2">How fast can you deliver my argumentative essay?</h4>
              <p className="text-slate-700 text-base">We can deliver as fast as 3 hours for urgent orders. Most essays are completed well before the deadline you set.</p>
            </div>
            <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-2 border-fuchsia-200">
              <h4 className="font-bold text-fuchsia-700 text-lg mb-2">Can I communicate with my writer?</h4>
              <p className="text-slate-700 text-base">Yes, you can message your assigned writer directly through your account dashboard after placing an order.</p>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
      <Dialog isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} title="Login">
        <LoginPage asModal onSuccess={handleLoginSuccess} />
      </Dialog>
      {/* Removed sticky OrderPriceCalculator as requested */}
    </div>
  );
}
