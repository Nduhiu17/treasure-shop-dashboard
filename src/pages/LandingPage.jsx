import React, { useState, useCallback } from "react";
import LoginPage from "../features/auth/LoginPage";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Button } from "../components/ui/button";
import { useAuth } from "../features/auth/AuthProvider";
import { Dialog } from "../components/ui/dialog";
import OrderPriceCalculator from "../components/OrderPriceCalculator";
import { useNavigate } from "react-router-dom";
// import all images from the images folder
import googleLogo from "../images/google-logo.png";
import sitejabberLogo from "../images/sitejabber-logo.png";
import reviewsioLogo from "../images/reviews-io.jpeg";
import trustpilotLogo from "../images/trust-pilot-logo.png";
import writer1 from "../images/writers/writer1.png";
import writer2 from "../images/writers/writer2.png";
import writer3 from "../images/writers/writer3.png";
import writerMichael from "../images/writers/michael_writer.png";
import writerEmily from "../images/writers/writer-emily.png";
import writerSarah from "../images/writers/writer-sarah.png";




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
      <main className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-0 sm:py-0">
        {/* HERO SECTION */}
        <section className="w-full bg-gradient-to-br from-fuchsia-100 via-white to-cyan-50 py-10 sm:py-20 px-2 sm:px-8 flex flex-col items-center relative overflow-hidden shadow-lg border-b border-fuchsia-100 animate-fade-in">
          <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between text-center md:text-left z-10 gap-12">
            <div className="flex-[2] min-w-0 flex flex-col items-center md:items-start">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-fuchsia-700 mb-4 leading-tight drop-shadow-lg">Custom argumentative essay writing service</h2>
              <div className="text-lg sm:text-2xl text-slate-700 mb-6 max-w-2xl">Struggling with your argumentative essay? Our subject matter experts can tailor a high-quality, AI-free paper to your needs, instructions, and deadline at an affordable price.</div>
              {/* <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center mb-2">
                <Button
                  onClick={() => {
                    if (user) {
                      navigate('/order/new');
                    } else {
                      setPendingOrder(true);
                      setLoginModalOpen(true);
                    }
                  }}
                  className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-bold shadow-xl hover:from-fuchsia-600 hover:to-cyan-700 px-10 py-4 text-xl rounded-2xl border-2 border-fuchsia-400 hover:scale-105 transition-transform duration-200"
                >
                  Order Now
                </Button>
              </div> */}
                 {/* FEATURED WRITTERS*/}
                  <section className="w-full mt-10 mb-10 px-0 animate-fade-in-up">
                    <div className="w-full bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center text-center border border-cyan-100 mx-auto max-w-7xl">
                      <div className="flex flex-wrap justify-evenly gap-6 w-full">
                         {/* Featured Writers with overlay rating and tooltip on hover */}
                         {[
                           {
                             name: "Featured Writer 1",
                             expertise: "Expert in Literature",
                             rating: 4.9,
                             img: writer1,
                             education: "PhD in English Literature",
                             orders: 320
                           },
                           {
                             name: "Featured Writer 2",
                             expertise: "Expert in History",
                             rating: 4.8,
                             img: writer3,
                             education: "MA in World History",
                             orders: 280
                           },
                           {
                             name: "Featured Writer 3",
                             expertise: "Expert in Science",
                             rating: 4.7,
                             img: writer2,
                             education: "MSc in Physics",
                             orders: 210
                           }
                         ].map((writer, idx) => (
                           <div key={idx} className="flex flex-col items-center group relative">
                             <div className="relative">
                               <img
                                 src={writer.img}
                                 alt={writer.name}
                                 className="h-20 w-20 rounded-full object-cover mb-2 border-2 border-transparent group-hover:border-fuchsia-400 transition duration-200 shadow-md"
                               />
                               {/* Rating badge */}
                               <span className="absolute bottom-1 right-1 bg-yellow-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow group-hover:scale-110 transition-transform">
                                 {writer.rating}★
                               </span>
                               {/* Tooltip */}
                               <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 hidden group-hover:block bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-2 text-sm text-slate-700 whitespace-nowrap min-w-[180px]">
                                 <div className="font-semibold text-fuchsia-700 mb-1">{writer.education}</div>
                                 <div>Orders filled: <span className="font-bold text-cyan-700">{writer.orders}</span></div>
                               </div>
                             </div>
                             <div className="text-cyan-900 font-semibold mt-1">{writer.expertise}</div>
                             {/* <div className="text-yellow-500 font-bold">{writer.expertise}</div> */}
                           </div>
                         ))}
                      </div>
                    </div>
                  </section>
            </div>
            {/* Well-positioned OrderPriceCalculator (not sticky, not overlay) */}
            <div className="flex-[1] min-w-0 flex flex-col items-center justify-center w-full md:w-auto mt-0 md:mt-0 h-full">
              <div
                className="w-full h-full flex flex-col justify-stretch min-h-[420px] md:min-h-[600px] bg-gradient-to-br from-fuchsia-100 via-white to-cyan-100 rounded-3xl shadow-2xl border-2 border-fuchsia-200 p-0 animate-fade-in-up"
                style={{ marginTop: '-2.5rem' }}
              >
                <OrderPriceCalculator
                  onProceed={handleCalculatorProceed}
                  className="w-full h-full flex-1 !min-h-[420px] md:!min-h-[600px] !rounded-3xl bg-transparent"
                />
                {/* Marketing carousel below calculator */}
                <div className="flex-1 flex flex-col items-center justify-end pb-6 pt-2">
                  <div className="relative w-full flex-1 flex items-end justify-center min-h-[100px]">
                    <div className="w-full max-w-xl overflow-hidden rounded-2xl shadow-lg border border-fuchsia-100 bg-white">
                      <div
                        className="flex items-center gap-8 carousel-track"
                        style={{
                          width: 'max-content',
                          animation: 'carousel-slide 32s linear infinite',
                        }}
                      >
                        {/* Marketing slides (repeat for seamless loop) */}
                        {[
                          {
                            img: require('../images/reviews-io.jpeg'),
                            alt: '5-Star Service',
                            headline: '5-Star Rated by Students',
                            text: 'Thousands of students trust us for fast, reliable, and original essays.'
                          },
                          {
                            img: require('../images/writers/writer1.png'),
                            alt: 'Expert Writers',
                            headline: 'Expert Writers, Real Results',
                            text: 'Work with top academic writers with advanced degrees and proven track records.'
                          },
                          {
                            img: require('../images/writers/writer-emily.png'),
                            alt: 'Personalized Support',
                            headline: 'Personalized Support',
                            text: 'Get 1-on-1 help and direct communication with your writer.'
                          },
                          {
                            img: require('../images/trust-pilot-logo.png'),
                            alt: 'Trusted Platform',
                            headline: 'Trusted by Students Worldwide',
                            text: 'Our platform is rated excellent on Trustpilot and other review sites.'
                          },
                          {
                            img: require('../images/google-logo.png'),
                            alt: 'Confidential & Secure',
                            headline: 'Confidential & Secure',
                            text: 'Your privacy is protected by advanced security and strict confidentiality.'
                          },
                        ].concat([
                          {
                            img: require('../images/reviews-io.jpeg'),
                            alt: '5-Star Service',
                            headline: '5-Star Rated by Students',
                            text: 'Thousands of students trust us for fast, reliable, and original essays.'
                          },
                          {
                            img: require('../images/writers/writer1.png'),
                            alt: 'Expert Writers',
                            headline: 'Expert Writers, Real Results',
                            text: 'Work with top academic writers with advanced degrees and proven track records.'
                          },
                          {
                            img: require('../images/writers/writer-emily.png'),
                            alt: 'Personalized Support',
                            headline: 'Personalized Support',
                            text: 'Get 1-on-1 help and direct communication with your writer.'
                          },
                          {
                            img: require('../images/trust-pilot-logo.png'),
                            alt: 'Trusted Platform',
                            headline: 'Trusted by Students Worldwide',
                            text: 'Our platform is rated excellent on Trustpilot and other review sites.'
                          },
                          {
                            img: require('../images/google-logo.png'),
                            alt: 'Confidential & Secure',
                            headline: 'Confidential & Secure',
                            text: 'Your privacy is protected by advanced security and strict confidentiality.'
                          },
                        ])
                        .map((slide, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col md:flex-row items-center gap-4 min-w-[260px] md:min-w-[340px] px-4 py-4"
                          >
                            <img
                              src={slide.img}
                              alt={slide.alt}
                              className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow border border-slate-100 bg-white"
                            />
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                              <div className="font-bold text-fuchsia-700 text-base md:text-lg mb-1">{slide.headline}</div>
                              <div className="text-slate-700 text-xs md:text-base">{slide.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <style>{`
                    @keyframes carousel-slide {
                      0% { transform: translateX(0); }
                      100% { transform: translateX(-50%); }
                    }
                    .carousel-track {
                      animation: carousel-slide 32s linear infinite;
                    }
                  `}</style>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute left-0 top-0 w-40 h-40 bg-fuchsia-200/30 rounded-full blur-2xl -z-1" />
          <div className="absolute right-0 bottom-0 w-60 h-60 bg-cyan-200/30 rounded-full blur-2xl -z-1" />
        </section>
        {/* RATINGS SECTION */}
        <section className="w-full mt-10 mb-10 px-0 animate-fade-in-up">
          <div className="w-full bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center text-center border border-cyan-100 mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-evenly gap-6 w-full">
              <div className="flex flex-col items-center">
                <img src={sitejabberLogo} alt="Sitejabber" className="h-8 mb-1" />
                <div className="text-cyan-900 font-semibold">Sitejabber</div>
                <div className="text-yellow-500 font-bold">4.9 <span className="text-cyan-700 font-normal">(188 reviews)</span></div>
              </div>
              <div className="flex flex-col items-center">
                <img src={reviewsioLogo} alt="Reviews.io" className="h-8 mb-1" />
                <div className="text-cyan-900 font-semibold">Reviews.io</div>
                <div className="text-yellow-500 font-bold">4.8 <span className="text-cyan-700 font-normal">(94 reviews)</span></div>
              </div>
              <div className="flex flex-col items-center">
                <img src={trustpilotLogo} alt="Trustpilot" className="h-8 mb-1" />
                <div className="text-cyan-900 font-semibold">Trustpilot</div>
                <div className="text-yellow-500 font-bold">4.8 <span className="text-cyan-700 font-normal">(20 reviews)</span></div>
              </div>
              <div className="flex flex-col items-center">
                <img src={googleLogo} alt="Google Reviews" className="h-8 mb-1" />
                <div className="text-cyan-900 font-semibold">Google Reviews</div>
                <div className="text-yellow-500 font-bold">4.6 <span className="text-cyan-700 font-normal">(14 reviews)</span></div>
              </div>
            </div>
          </div>
        </section>
        {/* FEATURES SECTION */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-12 px-4 animate-fade-in-up">
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
        <section className="w-full px-4 mb-20 animate-fade-in-up">
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
        <section className="w-full px-4 mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-700 mb-10 text-center tracking-tight">Trusted by Students from Top Universities</h2>
          <div className="w-full max-w-5xl mx-auto overflow-hidden relative">
            <div
              className="flex items-center gap-12 animate-universities-scroll"
              style={{
                width: 'max-content',
                animation: 'universities-scroll 30s linear infinite',
              }}
            >
              {[require("../images/universities/havard.jpeg"), require("../images/universities/oxford.png"), require("../images/universities/mit.png"), require("../images/universities/stanford.jpeg"), require("../images/universities/cambridge.png"), require("../images/universities/bekerly.png"), require("../images/universities/columbia.png"), require("../images/universities/toronto.png")].map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="University Logo"
                  className="h-12 w-auto grayscale hover:grayscale-0 transition duration-300 rounded-xl shadow-md border border-slate-100 bg-white px-2 py-1 mx-2"
                  style={{ minWidth: 80 }}
                />
              ))}
              {/* Duplicate for seamless loop */}
              {[require("../images/universities/havard.jpeg"), require("../images/universities/oxford.png"), require("../images/universities/mit.png"), require("../images/universities/stanford.jpeg"), require("../images/universities/cambridge.png"), require("../images/universities/bekerly.png"), require("../images/universities/columbia.png"), require("../images/universities/toronto.png")].map((src, idx) => (
                <img
                  key={idx + 100}
                  src={src}
                  alt="University Logo"
                  className="h-12 w-auto grayscale hover:grayscale-0 transition duration-300 rounded-xl shadow-md border border-slate-100 bg-white px-2 py-1 mx-2"
                  style={{ minWidth: 80 }}
                />
              ))}
            </div>
          </div>
        </section>
        <style>{`
          @keyframes universities-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-universities-scroll {
            animation: universities-scroll 30s linear infinite;
          }
        `}</style>
        {/* WRITERS SECTION */}
        <section className="w-full px-4 mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-700 mb-10 text-center tracking-tight">Meet Some of Our Top Writers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-fuchsia-50 to-cyan-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-fuchsia-200 hover:shadow-2xl transition-shadow duration-200">
              <img src={writerEmily} alt="Writer 1" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-fuchsia-200" />
              <h4 className="font-bold text-fuchsia-700 text-lg mb-1">Dr. Emily Carter</h4>
              <div className="text-cyan-700 text-sm mb-2">PhD in Political Science, 8+ years experience</div>
              <p className="text-slate-700 text-base">Specializes in argumentative essays, research papers, and policy analysis. Rated 4.9/5 by 320 students.</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-fuchsia-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-cyan-200 hover:shadow-2xl transition-shadow duration-200">
              <img src={writerMichael} alt="Writer 2" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-cyan-200" />
              <h4 className="font-bold text-cyan-700 text-lg mb-1">Prof. Michael Lee</h4>
              <div className="text-fuchsia-700 text-sm mb-2">MA in Philosophy, 10+ years experience</div>
              <p className="text-slate-700 text-base">Expert in logic, ethics, and persuasive writing. Rated 4.8/5 by 280 students.</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-fuchsia-50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center border-2 border-yellow-200 hover:shadow-2xl transition-shadow duration-200">
              <img src={writerSarah} alt="Writer 3" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-yellow-200" />
              <h4 className="font-bold text-yellow-600 text-lg mb-1">Sarah Johnson</h4>
              <div className="text-cyan-700 text-sm mb-2">MSc in Sociology, 6+ years experience</div>
              <p className="text-slate-700 text-base">Focuses on social sciences, argumentative essays, and case studies. Rated 4.9/5 by 210 students.</p>
            </div>
          </div>
        </section>
        {/* TESTIMONIALS SECTION */}
        <section className="w-full px-4 mb-20 animate-fade-in-up">
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
        <section className="w-full px-4 mb-20 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-fuchsia-700 mb-10 text-center tracking-tight">Frequently Asked Questions</h2>
          <FAQTwoColumn />
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

// FAQ data and component for two-column expandable FAQ
// (Keep these outside the LandingPage component)
const FAQ_QUESTIONS = [
  {
    question: "Is your argumentative essay writing service confidential?",
    answer:
      "Absolutely. We guarantee complete confidentiality for all customers. Your personal information and order details are never shared with third parties.",
    color: "fuchsia",
  },
  {
    question: "Will my essay be original and AI-free?",
    answer:
      "Yes. Every paper is written from scratch by a human expert and checked for both plagiarism and AI-generated content.",
    color: "cyan",
  },
  {
    question: "How fast can you deliver my argumentative essay?",
    answer:
      "We can deliver as fast as 3 hours for urgent orders. Most essays are completed well before the deadline you set.",
    color: "yellow",
  },
  {
    question: "Can I communicate with my writer?",
    answer:
      "Yes, you can message your assigned writer directly through your account dashboard after placing an order.",
    color: "fuchsia",
  },
];

function FAQTwoColumn() {
  const [openIndexes, setOpenIndexes] = React.useState([]);

  const toggle = (idx) => {
    setOpenIndexes((openIndexes) =>
      openIndexes.includes(idx)
        ? openIndexes.filter((i) => i !== idx)
        : [...openIndexes, idx]
    );
  };

  // Split into two columns
  const left = [], right = [];
  FAQ_QUESTIONS.forEach(function(q, i) {
    (i % 2 === 0 ? left : right).push({ ...q, idx: i });
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[left, right].map((col, colIdx) => (
        <div key={colIdx} className="space-y-6">
          {col.map(({ question, answer, color, idx }) => {
            // Color classes
            let border, text;
            if (color === "fuchsia") {
              border = "border-fuchsia-200";
              text = "text-fuchsia-700";
            } else if (color === "cyan") {
              border = "border-cyan-200";
              text = "text-cyan-700";
            } else if (color === "yellow") {
              border = "border-yellow-200";
              text = "text-yellow-600";
            } else {
              border = "border-slate-200";
              text = "text-slate-700";
            }
            const isOpen = openIndexes.includes(idx);
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br from-${color}-50 to-cyan-50 rounded-2xl shadow-lg border-2 ${border} transition-all duration-200`}
              >
                <button
                  className={`w-full flex items-center justify-between p-6 focus:outline-none ${text} font-bold text-lg group`}
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span>{question}</span>
                  <span className="ml-4 flex items-center">
                    <svg
                      className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180 text-fuchsia-500" : "rotate-0 text-slate-400"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div
                  id={`faq-answer-${idx}`}
                  className={`overflow-hidden transition-all duration-300 px-6 ${isOpen ? "max-h-40 py-2 opacity-100" : "max-h-0 py-0 opacity-0"}`}
                  style={{}}
                >
                  <p className="text-slate-700 text-base">{answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
