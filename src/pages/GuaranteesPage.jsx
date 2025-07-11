import React from "react";
import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";

const GUARANTEES = [
	{
		title: "100% Original Work",
		desc: "Every order is written from scratch and checked for plagiarism.",
	},
	{
		title: "On-Time Delivery",
		desc: "We guarantee your paper will be delivered by your deadline, or your money back.",
	},
	{
		title: "Confidentiality",
		desc: "Your privacy is our top priority. All orders are confidential.",
	},
	{
		title: "24/7 Support",
		desc: "Our support team is available around the clock to help you.",
	},
	{
		title: "Unlimited Revisions",
		desc: "We offer free revisions until you are fully satisfied.",
	},
	{
		title: "Money-Back Guarantee",
		desc: "If you are not satisfied, you get your money back—no questions asked.",
	},
];

export default function GuaranteesPage() {
  const { user, logout } = useAuth();
  return (
	<div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-50 via-white to-cyan-50">
	  <LandingNavbar user={user} onLogout={logout} />
	  <main className="flex-1 px-4 py-12 max-w-5xl mx-auto animate-fade-in">
		<h1 className="text-4xl sm:text-5xl font-extrabold text-fuchsia-700 mb-8 text-center drop-shadow-lg">Academic Codebase Guarantees</h1>

		{/* What You’ll Get at Academic Codebase */}
		<section className="mb-12 bg-white/80 rounded-3xl shadow-xl p-8 border border-fuchsia-100">
		  <h2 className="text-2xl font-bold text-cyan-700 mb-4">What You’ll Get at Academic Codebase</h2>
		  <p className="text-slate-700 text-base mb-4">At Academic Codebase, we’re committed to delivering more than just words on a page. Every order is handled by a qualified human expert, never AI, and goes through strict quality checks for originality, accuracy, and confidentiality. Here’s how we guarantee your satisfaction:</p>
		</section>

		{/* Quality Assurance & No AI Content */}
		<section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
		  <div className="bg-white rounded-3xl shadow-lg p-8 border border-cyan-100 flex flex-col items-center text-center">
			<h3 className="font-bold text-cyan-700 mb-3 text-xl">Quality Assurance</h3>
			<p className="text-slate-700 text-base">Every essay is checked for plagiarism and quality before delivery. We never resell papers, and each assignment is matched with a writer who has a degree in your field and a proven track record. Your paper will always be unique and tailored to your requirements.</p>
		  </div>
		  <div className="bg-white rounded-3xl shadow-lg p-8 border border-fuchsia-100 flex flex-col items-center text-center">
			<h3 className="font-bold text-fuchsia-700 mb-3 text-xl">No AI-Generated Content</h3>
			<p className="text-slate-700 text-base">A real human expert works on your order—never AI. While we use AI for free tools like title generators, our writers are strictly prohibited from using AI for content creation. Every order is screened to ensure it’s written by a person, not a machine.</p>
		  </div>
		</section>

		{/* Editing Policy & Confidentiality */}
		<section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
		  <div className="bg-white rounded-3xl shadow-lg p-8 border border-yellow-100 flex flex-col items-center text-center">
			<h3 className="font-bold text-yellow-600 mb-3 text-xl">Editing Policy</h3>
			<p className="text-slate-700 text-base">Want your paper to shine even brighter? Choose a top writer with a degree in your subject, or use our editing services for a thorough review. Our editors refine your work for clarity, structure, referencing, and language—ensuring it meets the highest academic standards.</p>
		  </div>
		  <div className="bg-white rounded-3xl shadow-lg p-8 border border-cyan-100 flex flex-col items-center text-center">
			<h3 className="font-bold text-cyan-700 mb-3 text-xl">100% Confidentiality</h3>
			<p className="text-slate-700 text-base">Your privacy is protected at every step. We only collect the information needed to fulfill your order, and your payment details are always secure. No one will ever know you used our service—your secret is safe with us.</p>
		  </div>
		</section>

		{/* Money-Back & 24/7 Support */}
		<section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
		  <div className="bg-white rounded-3xl shadow-lg p-8 border border-fuchsia-100 flex flex-col items-center text-center">
			<h3 className="font-bold text-fuchsia-700 mb-3 text-xl">Money-Back Guarantee</h3>
			<p className="text-slate-700 text-base">If your paper doesn’t meet your requirements or isn’t on topic, you can request a refund. We also offer unlimited free revisions for two weeks after delivery. If you haven’t downloaded your paper, you’re eligible for a full refund—no hassle.</p>
		  </div>
		  <div className="bg-white rounded-3xl shadow-lg p-8 border border-yellow-100 flex flex-col items-center text-center">
			<h3 className="font-bold text-yellow-600 mb-3 text-xl">24/7 Support</h3>
			<p className="text-slate-700 text-base">Our support team is available around the clock to answer your questions, help with orders, and provide instant quotes. Join our live chat for a quick response—no matter the time or question.</p>
		  </div>
		</section>

		{/* Call to Action */}
		<section className="mb-12 text-center">
		  <h2 className="text-2xl font-bold text-fuchsia-700 mb-4">Ready to see our guarantees in action?</h2>
		  <p className="text-slate-700 text-base mb-6">Let us match you with the perfect writer for your needs. Experience top-quality, plagiarism-free writing from a qualified expert—risk free!</p>
		  <Button
			as={Link}
			to="/create-order"
			className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg rounded-xl"
		  >
			Go to Order Form
		  </Button>
		</section>
	  </main>
	  <LandingFooter />
	</div>
  );
}
