import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import FloatingWhatsAppIcon from "../components/ui/FloatingWhatsAppIcon";
import { useAuth } from "../features/auth/AuthProvider";

export default function AboutPage() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50 overflow-x-hidden">
      <LandingNavbar user={user} onLogout={logout} />
      <FloatingWhatsAppIcon />
      <main className="flex-1 px-4 py-12 max-w-5xl mx-auto animate-fade-in relative">
        {/* Animated background shapes */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-fuchsia-200 opacity-30 rounded-full blur-2xl animate-pulse-slow z-0" />
        <div className="absolute top-1/2 right-0 w-32 h-32 bg-cyan-200 opacity-20 rounded-full blur-2xl animate-float z-0" />
        <div className="absolute bottom-0 left-1/2 w-28 h-28 bg-yellow-200 opacity-20 rounded-full blur-2xl animate-float-reverse z-0" />
        {/* <h1 className="text-4xl sm:text-5xl font-extrabold text-fuchsia-700 mb-8 text-center drop-shadow-lg">About Treasure Shop</h1> */}

        {/* Who We Are */}
        <section className="mb-12 bg-white/80 rounded-3xl shadow-xl p-8 border border-fuchsia-100">
          <h2 className="text-2xl font-bold text-cyan-700 mb-4">Who We Are</h2>
          <p className="text-slate-700 text-base mb-4">We are a dedicated team of professional writers, editors, proofreaders, and managers committed to helping you overcome any academic challenge. Whether you need a one-page essay or a final thesis polished, our university-educated experts deliver top-quality assistance quickly and reliably.</p>
          <p className="text-slate-700 text-base">Our founders struggled with writing in school, which inspired the creation of Treasure Shop—a service designed to help students improve their writing, achieve better grades under tight deadlines, and focus on what matters most. Not everyone is born a Shakespeare, but everyone deserves support to succeed.</p>
        </section>

        {/* Our Numbers & Other Facts */}
        <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-100">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-cyan-100 flex flex-col items-center text-center">
            <h3 className="font-bold text-cyan-700 mb-3 text-xl">Our Numbers</h3>
            <ul className="text-cyan-900 space-y-2 text-base">
              <li><span className="font-bold">50+</span> writing and editing services</li>
              <li><span className="font-bold">3,600+</span> writing experts</li>
              <li><span className="font-bold">250+</span> editing specialists</li>
              <li><span className="font-bold">40+</span> disciplines covered</li>
              <li><span className="font-bold">1 hour</span> minimum deadline</li>
              <li><span className="font-bold">100%</span> original, plagiarism-free texts</li>
              <li><span className="font-bold">45,000+</span> completed papers</li>
              <li><span className="font-bold">2-week</span> free revision period</li>
            </ul>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-yellow-100 flex flex-col items-center text-center">
            <h3 className="font-bold text-yellow-600 mb-3 text-xl">Other Facts</h3>
            <ul className="text-yellow-700 space-y-2 text-base text-left">
              <li>All experts have 3+ years of experience and hold MA or PhD degrees</li>
              <li>Every order is custom-made and strictly confidential</li>
              <li>Free extras included with every order</li>
              <li>Half of our customers become regulars</li>
              <li>24/7 support for every request</li>
            </ul>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-12 bg-white/80 rounded-3xl shadow-xl p-8 border border-cyan-100 animate-fade-in-up delay-200">
          <h2 className="text-2xl font-bold text-fuchsia-700 mb-4">What We Do</h2>
          <p className="text-slate-700 text-base mb-4">We provide custom academic help for all types of assignments. Our services cover a wide range of subjects and formats, all tailored to your needs. You can find the full list of services on our order form.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-fuchsia-50 rounded-2xl p-6 border border-fuchsia-100 shadow">
              <h4 className="font-bold text-fuchsia-700 mb-2">Writing Services</h4>
              <ul className="text-fuchsia-900 space-y-1">
                <li>Essays, papers, coursework, dissertations, reports, proposals, reviews, and more</li>
              </ul>
            </div>
            <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-100 shadow">
              <h4 className="font-bold text-cyan-700 mb-2">Editing & Proofreading</h4>
              <ul className="text-cyan-900 space-y-1">
                <li>Grammar and syntax improvement, structure and coherence, style and referencing checks, error and typo correction</li>
              </ul>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100 shadow md:col-span-2">
              <h4 className="font-bold text-yellow-600 mb-2">Assignment Help</h4>
              <ul className="text-yellow-700 space-y-1">
                <li>Support for non-writing assignments, presentations, projects, case studies, and more</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 text-slate-700 text-base">
            <p className="mb-2">Why choose us? You can delegate challenging tasks to professionals and ensure timely submission. Learn from our experts to improve your own writing, and get last-minute help whenever you need it. Our mission is to help you reach your goals with less stress and more confidence.</p>
          </div>
        </section>

        {/* What We Offer / Guarantees */}
        <section className="mb-12 bg-white/80 rounded-3xl shadow-xl p-8 border border-yellow-100 animate-fade-in-up delay-300">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">What We Offer</h2>
          <ul className="list-decimal pl-6 text-yellow-700 text-lg space-y-2 mb-4">
            <li>All writing and editing is done from scratch, following your instructions to the letter.</li>
            <li>Our team consists exclusively of native speakers for flawless grammar and vocabulary.</li>
            <li>Every text is checked with advanced plagiarism detectors to ensure 100% originality.</li>
            <li>We always deliver on time—late submissions are not an option.</li>
            <li>If you’re not satisfied, we offer free revisions or a refund.</li>
          </ul>
          <div className="text-slate-700 text-base mt-4">
            <p className="mb-2">Your privacy and security are our top priorities. We protect your data with a strict privacy policy and secure payment systems. Your customer profile gives you full control over your orders, lets you chat with your expert and support, and keeps you in charge from start to finish.</p>
          </div>
        </section>

        {/* Sneak Peek / Reviews */}
        <section className="mb-10 animate-fade-in-up delay-400">
          <h2 className="text-2xl font-bold text-cyan-700 mb-2">Want a Sneak Peek?</h2>
          <p className="text-slate-700 text-base">See what our customers say—visit our <a href="/reviews" className="text-fuchsia-600 underline hover:text-fuchsia-800">reviews</a> page to discover why students trust us for their most important assignments.</p>
        </section>
      </main>
      <LandingFooter />
      {/* Tailwind custom keyframes for AboutPage animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.4,0,0.2,1) both; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        .animate-float-reverse { animation: float-reverse 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
