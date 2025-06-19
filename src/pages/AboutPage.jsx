import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { useAuth } from "../features/auth/AuthProvider";

export default function AboutPage() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <LandingNavbar user={user} onLogout={logout} />
      <main className="flex-1 px-4 py-12 max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6">About Us</h1>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Who We Are</h2>
          <p className="text-blue-900 mb-4">Treasure Shop is a world-class academic writing and editing platform, trusted by thousands of students and professionals worldwide. We connect you with top writers, editors, and subject experts to help you succeed in your academic journey.</p>
        </section>
        <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">Our Numbers</h3>
            <ul className="text-blue-800 space-y-1">
              <li><span className="font-bold">500+</span> expert writers</li>
              <li><span className="font-bold">100+</span> editing experts</li>
              <li><span className="font-bold">80+</span> disciplines covered</li>
              <li><span className="font-bold">20,000+</span> completed papers</li>
              <li><span className="font-bold">98%</span> satisfaction rate</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2">What We Offer</h3>
            <ul className="text-blue-800 space-y-1">
              <li>Custom writing for all academic levels</li>
              <li>Editing and proofreading</li>
              <li>Research and data analysis</li>
              <li>Plagiarism-free guarantee</li>
              <li>24/7 support</li>
            </ul>
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Our Facts</h2>
          <ul className="list-disc pl-6 text-blue-900">
            <li>All writers are degree-holders and pass a rigorous selection process.</li>
            <li>We use the latest technology for plagiarism detection and quality control.</li>
            <li>Our platform is secure, confidential, and easy to use.</li>
          </ul>
        </section>
        <section className="mb-10">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Want a Sneak Peek?</h2>
          <p className="text-blue-900">Check out our <a href="/reviews" className="text-blue-600 underline hover:text-blue-800">reviews</a> and see why students trust us for their most important assignments.</p>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
