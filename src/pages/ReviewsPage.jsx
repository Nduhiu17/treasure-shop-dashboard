import React from "react";

import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Button } from "../components/ui/button";
import { useAuth } from "../features/auth/AuthProvider";

import sitejabberLogo from "../images/sitejabber-logo.png";
import reviewsIoLogo from "../images/reviews-io.jpeg";
import trustpilotLogo from "../images/trust-pilot-logo.png";
import googleLogo from "../images/google-logo.png";
import customerExperienceImage from "../images/customer-experience.jpg"

const REVIEWS = [
	{
		name: "Jane Doe",
		type: "Research Paper",
		subject: "Psychology",
		rating: 5,
		text: "Absolutely amazing! My paper was delivered on time and exceeded my expectations.",
		location: "USA",
	},
	{
		name: "John Smith",
		type: "Essay",
		subject: "History",
		rating: 4,
		text: "Great service, very responsive support. Will use again!",
		location: "UK",
	},
	{
		name: "Maria Rossi",
		type: "Dissertation",
		subject: "Business",
		rating: 5,
		text: "Professional writers and top-notch quality. Highly recommended!",
		location: "Italy",
	},
	{
		name: "Priya Patel",
		type: "Assignment",
		subject: "Biology",
		rating: 5,
		text: "Fast, reliable, and accurate. My go-to for assignments!",
		location: "India",
	},
	{
		name: "Tom Lee",
		type: "Lab Report",
		subject: "Chemistry",
		rating: 4,
		text: "Clear data and great visuals. Helped me get an A!",
		location: "Singapore",
	},
	{
		name: "Sophie Müller",
		type: "Article",
		subject: "Marketing",
		rating: 5,
		text: "SEO-optimized and engaging. My blog is thriving!",
		location: "Germany",
	},
	{
		name: "Lucas Martin",
		type: "Book Report/Review",
		subject: "Literature",
		rating: 5,
		text: "Insightful and original analysis. Teacher was impressed.",
		location: "France",
	},
	{
		name: "Olivia Brown",
		type: "Case Study",
		subject: "Business",
		rating: 5,
		text: "Real-world recommendations and great structure.",
		location: "Canada",
	},
	{
		name: "Noah Kim",
		type: "Math Problems",
		subject: "Mathematics",
		rating: 5,
		text: "Step-by-step solutions made everything clear.",
		location: "South Korea",
	},
	{
		name: "Ava Johnson",
		type: "Resume",
		subject: "Career",
		rating: 5,
		text: "Landed interviews right away. Highly recommend!",
		location: "USA",
	},
	{
		name: "Mila Ivanova",
		type: "PowerPoint Presentation",
		subject: "History",
		rating: 5,
		text: "Visually stunning slides. My classmates were wowed!",
		location: "Russia",
	},
	{
		name: "Jack O'Connor",
		type: "Homework",
		subject: "Physics",
		rating: 4,
		text: "Quick help and accurate answers every time.",
		location: "Ireland",
	},
	{
		name: "Harper Lee",
		type: "Nursing Paper",
		subject: "Nursing",
		rating: 5,
		text: "Written by a real nurse. Super helpful!",
		location: "Australia",
	},
	{
		name: "Elijah Wang",
		type: "Personal Statement",
		subject: "Admissions",
		rating: 5,
		text: "Got into my dream school!",
		location: "China",
	},
	{
		name: "Layla Silva",
		type: "Proofreading",
		subject: "English",
		rating: 5,
		text: "No more grammar mistakes. Fast and thorough!",
		location: "Brazil",
	},
	{
		name: "Sebastian Dubois",
		type: "Term Paper",
		subject: "Economics",
		rating: 4,
		text: "Very detailed and well-cited. Will use again.",
		location: "Belgium",
	},
	{
		name: "Penelope Adams",
		type: "Research Proposal",
		subject: "Sociology",
		rating: 5,
		text: "My proposal was accepted! Great job.",
		location: "USA",
	},
	{
		name: "David Green",
		type: "Discussion Board Post",
		subject: "Philosophy",
		rating: 4,
		text: "Thoughtful and engaging posts. Helped my participation grade.",
		location: "UK",
	},
	{
		name: "Scarlett Evans",
		type: "Coursework",
		subject: "Political Science",
		rating: 5,
		text: "Helped me manage a heavy workload. Consistent quality!",
		location: "New Zealand",
	},
	{
		name: "Matthew Clark",
		type: "Cover Letter Writing",
		subject: "Job Search",
		rating: 5,
		text: "Got the interview! Very professional letter.",
		location: "USA",
	},
];

const RATINGS = [5, 4, 3];
const TYPES = [
	"Argumentative Essay",
	"Article",
	"Assignment",
	"Book Report/Review",
	"Case Study",
	"Coursework",
	"Cover Letter Writing",
	"Discussion Board Post",
	"Dissertation",
	"Homework",
	"Lab Report",
	"Math Problems",
	"Movie Review",
	"Nursing Paper",
	"Personal Statement",
	"PowerPoint Presentation",
	"Proofreading",
	"Research Paper",
	"Research Proposal",
	"Resume",
	"Term Paper",
];

export default function ReviewsPage() {
	const { user, logout } = useAuth();
	const [selectedType, setSelectedType] = React.useState("");
	const [selectedRating, setSelectedRating] = React.useState(0);

	const filtered = REVIEWS.filter(
		(r) =>
			(!selectedType || r.type === selectedType) &
			(!selectedRating || r.rating === selectedRating)
	);

	return (
	  <div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-100 via-cyan-100 to-blue-100">
		<LandingNavbar user={user} onLogout={logout} />
		<main className="flex-1 px-4 py-12 max-w-7xl mx-auto animate-fade-in">
			{/* HERO SECTION - Enhanced */}
			<section className="mb-14 text-center relative overflow-hidden">
			  {/* Animated gradient background */}
			  <div className="absolute inset-0 pointer-events-none z-0">
				<div className="w-full h-64 bg-gradient-to-br from-fuchsia-400 via-cyan-300 to-blue-300 blur-3xl opacity-70 animate-gradient-x" />
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-40 bg-gradient-to-r from-fuchsia-200 via-cyan-100 to-blue-200 opacity-40 rounded-full blur-2xl animate-pulse" />
			  </div>
			  <h1 className="relative z-10 text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-700 via-cyan-700 to-blue-800 mb-5 drop-shadow-2xl tracking-tight animate-fade-in-up">
				Real Stories. Real Results.
			  </h1>
			  <p className="relative z-10 text-xl sm:text-2xl text-blue-900 max-w-3xl mx-auto mb-8 animate-fade-in-up delay-100">
				Discover why thousands of students and professionals trust us to help them succeed. Our commitment to quality and satisfaction is reflected in every review.
			  </p>
			  {/* Ratings Section - Modernized */}
			  <div className="flex flex-wrap justify-center gap-8 mt-8 relative z-10 animate-fade-in-up delay-200">
				<div className="bg-white/90 rounded-3xl shadow-xl p-8 border-t-4 border-fuchsia-400 min-w-[200px] flex flex-col items-center hover:scale-105 transition-transform duration-200">
				  <div className="text-3xl font-extrabold text-fuchsia-600 mb-1">45,000+</div>
				  <div className="text-blue-800 text-base">On-site reviews</div>
				</div>
				<div className="bg-gradient-to-br from-cyan-100 via-white to-blue-100 rounded-3xl shadow-xl p-8 border-t-4 border-cyan-400 text-center flex flex-col items-center hover:scale-105 transition-transform duration-200">
				  <img src={reviewsIoLogo} alt="Onsite Reviews" className="h-10 w-auto mb-2 rounded shadow" />
				  <h3 className="font-bold text-blue-900 text-lg mb-2">Onsite Reviews</h3>
				  <div className="text-4xl font-extrabold text-green-600 mb-1">4.8/5</div>
				  <div className="text-blue-800 text-base">Based on 2,000+ reviews</div>
				</div>
				<div className="bg-gradient-to-br from-fuchsia-100 via-white to-cyan-100 rounded-3xl shadow-xl p-8 border-t-4 border-fuchsia-400 text-center flex flex-col items-center hover:scale-105 transition-transform duration-200">
				  <img src={sitejabberLogo} alt="Sitejabber" className="h-10 w-auto mb-2" />
				  <h3 className="font-bold text-blue-900 text-lg mb-2">Sitejabber</h3>
				  <div className="text-4xl font-extrabold text-green-600 mb-1">4.7/5</div>
				  <div className="text-blue-800 text-base">1,200+ reviews</div>
				</div>
				<div className="bg-gradient-to-br from-blue-100 via-white to-fuchsia-100 rounded-3xl shadow-xl p-8 border-t-4 border-blue-400 text-center flex flex-col items-center hover:scale-105 transition-transform duration-200">
				  <img src={trustpilotLogo} alt="Trustpilot" className="h-10 w-auto mb-2" />
				  <h3 className="font-bold text-blue-900 text-lg mb-2">Trustpilot</h3>
				  <div className="text-4xl font-extrabold text-green-600 mb-1">4.6/5</div>
				  <div className="text-blue-800 text-base">900+ reviews</div>
				</div>
				<div className="bg-gradient-to-br from-cyan-100 via-white to-fuchsia-100 rounded-3xl shadow-xl p-8 border-t-4 border-cyan-400 text-center flex flex-col items-center hover:scale-105 transition-transform duration-200">
				  <img src={googleLogo} alt="Google Reviews" className="h-10 w-auto mb-2" />
				  <h3 className="font-bold text-blue-900 text-lg mb-2">Google Reviews</h3>
				  <div className="text-4xl font-extrabold text-green-600 mb-1">4.9/5</div>
				  <div className="text-blue-800 text-base">500+ reviews</div>
				</div>
			  </div>
			</section>

			{/* WHY CHOOSE US */}

				{/* TESTIMONIALS SECTION - Modernized */}
				<section className="mb-14">
				  <h2 className="text-3xl font-extrabold text-fuchsia-700 mb-8 text-center tracking-tight animate-fade-in-up">Latest Client Testimonials</h2>
				  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{REVIEWS.slice(0, 6).map((r, i) => (
					  <div
						key={i}
						className={`relative bg-gradient-to-br from-white via-fuchsia-50 to-cyan-50 rounded-3xl shadow-xl p-8 border-t-4 ${i%3===0 ? 'border-fuchsia-400' : i%3===1 ? 'border-cyan-400' : 'border-blue-400'} flex flex-col gap-3 animate-fade-in-up delay-${i*50}`}
					  >
						<div className="flex items-center gap-2 mb-1">
						  <span className="font-bold text-blue-900 text-lg">{r.name}</span>
						  <span className="text-xs text-blue-500">({r.location})</span>
						</div>
						<div className="flex gap-1 mb-2">
						  {Array(r.rating).fill(0).map((_,i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
						  {Array(5-r.rating).fill(0).map((_,i) => <span key={i} className="text-blue-200 text-lg">★</span>)}
						</div>
						<p className="text-blue-800 italic">“{r.text}”</p>
						<div className="text-blue-700 text-sm mt-2">{r.type} &mdash; {r.subject}</div>
					  </div>
					))}
				  </div>
				</section>
				<section className="mb-10">
					<div className="flex flex-col md:flex-row gap-4 mb-4">
						<select
							value={selectedType}
							onChange={(e) => setSelectedType(e.target.value)}
							className="rounded-lg border border-blue-200 px-4 py-2 text-blue-900"
						>
							<option value="">All Types</option>
							{TYPES.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
						<select
							value={selectedRating}
							onChange={(e) =>
								setSelectedRating(Number(e.target.value))
							}
							className="rounded-lg border border-blue-200 px-4 py-2 text-blue-900"
						>
							<option value={0}>All Ratings</option>
							{RATINGS.map((r) => (
								<option key={r} value={r}>
									{r} Stars
								</option>
							))}
						</select>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filtered.map((r, i) => (
							<div
								key={i}
								className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
							>
								<div className="flex items-center gap-2 mb-2">
									<span className="font-bold text-blue-900">{r.name}</span>
									<span className="text-yellow-500">
										{"★".repeat(r.rating)}
										{"☆".repeat(5 - r.rating)}
									</span>
								</div>
								<div className="text-blue-800 text-sm mb-1">
									{r.type} - {r.subject}
								</div>
								<div className="text-blue-900 mb-2">"{r.text}"</div>
								<div className="text-xs text-blue-400">{r.location}</div>
							</div>
						))}
						{filtered.length === 0 && (
							<div className="col-span-full text-blue-700 text-center">
								No reviews found for selected filters.
							</div>
						)}
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
				{/* HOW WE ENSURE CUSTOMER SATISFACTION - Improved Design */}
				<section className="mb-16">
				  <div className="bg-gradient-to-r from-fuchsia-100 via-cyan-100 to-blue-100 rounded-3xl shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 border border-blue-200">
					<div className="flex-1">
					  <h2 className="text-2xl sm:text-3xl font-extrabold text-fuchsia-700 mb-4 flex items-center gap-2">
						<svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
						  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
						  <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
						</svg>
						How We Ensure Customer Satisfaction
					  </h2>
					  <ul className="space-y-4 text-blue-900 text-lg">
						<li className="flex items-start gap-3">
						  <span className="inline-block mt-1 text-cyan-500">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
						  </span>
						  <span><span className="font-bold">Personalized approach:</span> Every order is tailored to your needs and academic level.</span>
						</li>
						<li className="flex items-start gap-3">
						  <span className="inline-block mt-1 text-cyan-500">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
						  </span>
						  <span><span className="font-bold">Rigorous quality control:</span> All work is checked by editors and passes multiple QA checks before delivery.</span>
						</li>
						<li className="flex items-start gap-3">
						  <span className="inline-block mt-1 text-cyan-500">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" /></svg>
						  </span>
						  <span><span className="font-bold">Focus on results:</span> We care about your success and offer unlimited free revisions until you are satisfied.</span>
						</li>
					<Button
					className="bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-blue-500 text-white font-bold shadow-lg hover:from-fuchsia-600 hover:to-blue-700 px-10 py-4 text-lg rounded-2xl mt-8 transition-all duration-200"
					onClick={() => {
					  if (user) {
						window.location.href = '/order/new';
					  } else {
						window.location.href = '/login?redirect=/order/new';
					  }
					}}
				>
					Get Started
				</Button> 	  </ul>
		
					</div>
					<div className="flex-3 flex justify-center">
					  <img src={customerExperienceImage} alt="Customer Satisfaction" className="max-h-60 w-auto rounded-2xl shadow-lg border border-blue-100 bg-white" />
					</div>
				  </div>
				</section>
				{/* OUR GLOBAL REACH - Modernized */}
				<section className="mb-16">
				  <div className="bg-gradient-to-r from-blue-100 via-cyan-100 to-fuchsia-100 rounded-3xl shadow-2xl p-10 md:p-16 border border-blue-200 flex flex-col md:flex-row items-center gap-10">
					<div className="flex-1 flex flex-col gap-8">
					  <h2 className="text-3xl sm:text-4xl font-extrabold text-cyan-700 mb-4 flex items-center gap-2 animate-fade-in-up">
						<svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
						  <path d="M2 12h20M12 2v20" stroke="currentColor" strokeWidth="2" fill="none" />
						</svg>
						Our Global Reach
					  </h2>
					  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<div className="bg-white rounded-2xl shadow p-8 border-t-4 border-fuchsia-400 text-center flex flex-col items-center hover:scale-105 transition-transform duration-200">
						  <span className="text-4xl font-extrabold text-fuchsia-600 mb-1">10,000+</span>
						  <span className="text-blue-800 text-lg">Total Clients</span>
						  <span className="text-blue-500 text-xs mt-1">Students and professionals worldwide</span>
						</div>
						<div className="bg-white rounded-2xl shadow p-8 border-t-4 border-cyan-400 text-center flex flex-col items-center hover:scale-105 transition-transform duration-200">
						  <span className="text-4xl font-extrabold text-cyan-600 mb-1">50+</span>
						  <span className="text-blue-800 text-lg">Total Countries</span>
						  <span className="text-blue-500 text-xs mt-1">Clients from every continent</span>
						</div>
						<div className="bg-white rounded-2xl shadow p-8 border-t-4 border-blue-400 text-center flex flex-col items-center hover:scale-105 transition-transform duration-200">
						  <span className="text-4xl font-extrabold text-yellow-500 mb-1">30+</span>
						  <span className="text-blue-800 text-lg">New Clients Daily</span>
						  <span className="text-blue-500 text-xs mt-1">Join our growing community</span>
						</div>
					  </div>
					</div>
					<div className="flex-1 flex justify-center">
					  <img
						src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg"
						alt="Global Map"
						className="rounded-2xl shadow-lg border border-blue-100 w-full max-w-md bg-white animate-fade-in-up"
					  />
					</div>
				  </div>
				</section>
				{/* FAQ - Modernized */}
				<section className="mb-16">
				  <div className="max-w-3xl mx-auto bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-blue-50 rounded-3xl shadow-2xl border border-blue-100 p-10">
					<h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-10 text-center animate-fade-in-up">Frequently Asked Questions</h2>
					<div className="space-y-6">
					  <details className="group border-b-2 border-blue-100 pb-4 bg-white/70 rounded-xl shadow-sm px-4 transition-all">
						<summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-blue-900 group-open:text-fuchsia-600 transition-colors py-3">
						  <span>Is my information confidential?</span>
						  <span className="ml-2 text-fuchsia-500 transition-transform group-open:rotate-180">&#9660;</span>
						</summary>
						<div className="mt-2 text-blue-700">Yes, we guarantee complete privacy and confidentiality for all clients and orders.</div>
					  </details>
					  <details className="group border-b-2 border-blue-100 pb-4 bg-white/70 rounded-xl shadow-sm px-4 transition-all">
						<summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-blue-900 group-open:text-fuchsia-600 transition-colors py-3">
						  <span>Can I communicate with my writer?</span>
						  <span className="ml-2 text-fuchsia-500 transition-transform group-open:rotate-180">&#9660;</span>
						</summary>
						<div className="mt-2 text-blue-700">Absolutely! You can message your writer directly through our secure platform.</div>
					  </details>
					  <details className="group border-b-2 border-blue-100 pb-4 bg-white/70 rounded-xl shadow-sm px-4 transition-all">
						<summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-blue-900 group-open:text-fuchsia-600 transition-colors py-3">
						  <span>What if I need revisions?</span>
						  <span className="ml-2 text-fuchsia-500 transition-transform group-open:rotate-180">&#9660;</span>
						</summary>
						<div className="mt-2 text-blue-700">We offer unlimited free revisions until you are fully satisfied with your order.</div>
					  </details>
					  <details className="group border-b-2 border-blue-100 pb-4 bg-white/70 rounded-xl shadow-sm px-4 transition-all">
						<summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-blue-900 group-open:text-fuchsia-600 transition-colors py-3">
						  <span>How do I pay?</span>
						  <span className="ml-2 text-fuchsia-500 transition-transform group-open:rotate-180">&#9660;</span>
						</summary>
						<div className="mt-2 text-blue-700">We accept all major credit cards and secure payment methods for your convenience.</div>
					  </details>
					</div>
				  </div>
				</section>
			</main>
			<LandingFooter />
		</div>
	);
}
