import React from "react";

import LandingNavbar from "../components/LandingNavbar";
import LandingFooter from "../components/LandingFooter";
import { Button } from "../components/ui/button";
import { useAuth } from "../features/auth/AuthProvider";

import sitejabberLogo from "../images/sitejabber-logo.png";
import reviewsIoLogo from "../images/reviews-io.jpeg";
import trustpilotLogo from "../images/trust-pilot-logo.png";
import googleLogo from "../images/google-logo.png";

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
			{/* HERO SECTION */}
			<section className="mb-10 text-center relative">
				<div className="absolute inset-0 pointer-events-none z-0">
					<div className="w-full h-40 bg-gradient-to-r from-fuchsia-300 via-cyan-200 to-blue-200 blur-2xl opacity-60 animate-gradient-x" />
				</div>
				<h1 className="relative z-10 text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 via-cyan-600 to-blue-700 mb-4 drop-shadow-lg">
					What Our Clients Say
				</h1>
				<p className="relative z-10 text-lg sm:text-xl text-blue-900 max-w-2xl mx-auto mb-6">
					Our clients are at the heart of everything we do. We value their feedback and do our best to ensure they leave our website fully satisfied.
				</p>
				<div className="flex flex-wrap justify-center gap-4 mt-6">
					<div className="bg-white/80 rounded-2xl shadow-lg p-6 border border-blue-100 min-w-[180px]">
						<div className="text-2xl font-extrabold text-fuchsia-600 mb-1">45,000+</div>
						<div className="text-blue-800 text-sm">On-site reviews</div>
					</div>
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center flex flex-col items-center">
						<img src={reviewsIoLogo} alt="Onsite Reviews" className="h-8 w-auto mb-2 rounded" />
						<h3 className="font-bold text-blue-900 text-lg mb-2">Onsite Reviews</h3>
						<div className="text-3xl font-extrabold text-green-600 mb-1">4.8/5</div>
						<div className="text-blue-800 text-sm">Based on 2,000+ reviews</div>
					</div>
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center flex flex-col items-center">
						<img src={sitejabberLogo} alt="Sitejabber" className="h-8 w-auto mb-2" />
						<h3 className="font-bold text-blue-900 text-lg mb-2">Sitejabber</h3>
						<div className="text-3xl font-extrabold text-green-600 mb-1">4.7/5</div>
						<div className="text-blue-800 text-sm">1,200+ reviews</div>
					</div>
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center flex flex-col items-center">
						<img src={trustpilotLogo} alt="Trustpilot" className="h-8 w-auto mb-2" />
						<h3 className="font-bold text-blue-900 text-lg mb-2">Trustpilot</h3>
						<div className="text-3xl font-extrabold text-green-600 mb-1">4.6/5</div>
						<div className="text-blue-800 text-sm">900+ reviews</div>
					</div>
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center flex flex-col items-center">
						<img src={googleLogo} alt="Google Reviews" className="h-8 w-auto mb-2" />
						<h3 className="font-bold text-blue-900 text-lg mb-2">Google Reviews</h3>
						<div className="text-3xl font-extrabold text-green-600 mb-1">4.9/5</div>
						<div className="text-blue-800 text-sm">500+ reviews</div>
					</div>
				</div>
			</section>

			{/* WHY CHOOSE US */}

				{/* TESTIMONIALS SECTION */}
				<section className="mb-12">
					<h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Latest Client Testimonials</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{/* Example testimonials, replace with real data as needed */}
						<div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-2 border-t-4 border-fuchsia-400 animate-fade-in">
							<div className="flex items-center gap-2">
								<span className="font-bold text-blue-900">Sarah K.</span>
								<span className="text-xs text-blue-500">(UK)</span>
							</div>
							<p className="text-blue-800">“Absolutely amazing service! My essay was delivered ahead of time and exceeded my expectations.”</p>
							<div className="flex gap-1 mt-1">
								{Array(5).fill(0).map((_,i) => <span key={i} className="text-yellow-400">★</span>)}
							</div>
						</div>
						<div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-2 border-t-4 border-cyan-400 animate-fade-in delay-100">
							<div className="flex items-center gap-2">
								<span className="font-bold text-blue-900">James L.</span>
								<span className="text-xs text-blue-500">(USA)</span>
							</div>
							<p className="text-blue-800">“The writer followed all my instructions perfectly. I got an A+ on my assignment!”</p>
							<div className="flex gap-1 mt-1">
								{Array(5).fill(0).map((_,i) => <span key={i} className="text-yellow-400">★</span>)}
							</div>
						</div>
						<div className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col gap-2 border-t-4 border-blue-400 animate-fade-in delay-200">
							<div className="flex items-center gap-2">
								<span className="font-bold text-blue-900">Priya S.</span>
								<span className="text-xs text-blue-500">(India)</span>
							</div>
							<p className="text-blue-800">“Customer support was super helpful and my paper was flawless. Highly recommend!”</p>
							<div className="flex gap-1 mt-1">
								{Array(5).fill(0).map((_,i) => <span key={i} className="text-yellow-400">★</span>)}
							</div>
						</div>
						{/* Add more testimonials as needed */}
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
				<section className="mb-10">
					<h2 className="text-xl font-bold text-blue-800 mb-2">
						How we ensure customer satisfaction
					</h2>
					<ul className="list-disc pl-6 text-blue-900 mb-4">
						<li>
							<span className="font-bold">Personalized approach:</span> Every
							order is tailored to your needs.
						</li>
						<li>
							<span className="font-bold">Rigorous quality control:</span> All
							work is checked by editors before delivery.
						</li>
						<li>
							<span className="font-bold">Focus on the result:</span> We care
							about your success and satisfaction.
						</li>
					</ul>
					<Button className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg rounded-xl mt-4">
						Get Started
					</Button>
				</section>
				<section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center">
						<h3 className="font-bold text-blue-900 text-lg mb-2 flex items-center justify-center gap-2">
							<svg
								className="w-6 h-6 text-green-500"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<circle
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
								/>
								<path
									d="M8 12l2 2 4-4"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
								/>
							</svg>
							Total Clients
						</h3>
						<div className="text-3xl font-extrabold text-green-600 mb-1">
							10,000+
						</div>
						<div className="text-blue-800 text-sm">
							Students and professionals worldwide
						</div>
					</div>
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center">
						<h3 className="font-bold text-blue-900 text-lg mb-2 flex items-center justify-center gap-2">
							<svg
								className="w-6 h-6 text-blue-500"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path
									d="M2 12h20M12 2v20"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
								/>
							</svg>
							Total Countries
						</h3>
						<div className="text-3xl font-extrabold text-green-600 mb-1">
							50+
						</div>
						<div className="text-blue-800 text-sm">
							Clients from every continent
						</div>
					</div>
					<div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 text-center">
						<h3 className="font-bold text-blue-900 text-lg mb-2 flex items-center justify-center gap-2">
							<svg
								className="w-6 h-6 text-yellow-500"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<circle
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
								/>
								<path
									d="M12 6v6l4 2"
									stroke="currentColor"
									strokeWidth="2"
									fill="none"
								/>
							</svg>
							New Clients Daily
						</h3>
						<div className="text-3xl font-extrabold text-green-600 mb-1">
							30+
						</div>
						<div className="text-blue-800 text-sm">
							Join our growing community
						</div>
					</div>
				</section>
				<section className="mb-10">
					<h2 className="text-xl font-bold text-blue-800 mb-2 flex items-center gap-2">
						<svg
							className="w-6 h-6 text-blue-500"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path
								d="M2 12h20M12 2v20"
								stroke="currentColor"
								strokeWidth="2"
								fill="none"
							/>
						</svg>
						Our Global Reach
					</h2>
					<div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center mb-6">
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg"
							alt="Global Map"
							className="rounded-2xl shadow-lg border border-blue-100 w-full max-w-md"
						/>
						<div className="flex-1 flex flex-col gap-4">
							<div className="flex items-center gap-2 text-blue-900 text-lg font-semibold">
								<svg
									className="w-5 h-5 text-green-500"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<circle
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="2"
										fill="none"
									/>
									<path
										d="M8 12l2 2 4-4"
										stroke="currentColor"
										strokeWidth="2"
										fill="none"
									/>
								</svg>
								Clients in 50+ countries
							</div>
							<div className="flex items-center gap-2 text-blue-900 text-lg font-semibold">
								<svg
									className="w-5 h-5 text-blue-500"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										d="M2 12h20M12 2v20"
										stroke="currentColor"
										strokeWidth="2"
										fill="none"
									/>
								</svg>
								10,000+ satisfied clients
							</div>
							<div className="flex items-center gap-2 text-blue-900 text-lg font-semibold">
								<svg
									className="w-5 h-5 text-yellow-500"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<circle
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="2"
										fill="none"
									/>
									<path
										d="M12 6v6l4 2"
										stroke="currentColor"
										strokeWidth="2"
										fill="none"
									/>
								</svg>
								30+ new clients daily
							</div>
						</div>
					</div>
				</section>
				<section className="mb-10">
					<h2 className="text-xl font-bold text-blue-800 mb-2">
						Frequently Asked Questions
					</h2>
					<ul className="list-disc pl-6 text-blue-900 space-y-2">
						<li>
							<span className="font-bold">Is my information confidential?</span>{" "}
							Yes, we guarantee complete privacy and confidentiality.
						</li>
						<li>
							<span className="font-bold">Can I communicate with my writer?</span>{" "}
							Absolutely! You can message your writer directly.
						</li>
						<li>
							<span className="font-bold">What if I need revisions?</span> We
							offer unlimited free revisions until you are satisfied.
						</li>
						<li>
							<span className="font-bold">How do I pay?</span> We accept all
							major credit cards and secure payment methods.
						</li>
					</ul>
				</section>
			</main>
			<LandingFooter />
		</div>
	);
}
