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
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
			<LandingNavbar user={user} onLogout={logout} />
			<main className="flex-1 px-4 py-12 max-w-5xl mx-auto animate-fade-in">
				<h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6">
					Our Guarantees
				</h1>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
					{GUARANTEES.map((g, i) => (
						<div
							key={i}
							className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100"
						>
							<h3 className="font-bold text-blue-900 mb-2">{g.title}</h3>
							<p className="text-blue-800 text-sm">{g.desc}</p>
						</div>
					))}
				</section>
				<div className="text-center mt-8">
					<Button
						as={Link}
						to="/create-order"
						className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg rounded-xl"
					>
						Go to Order Form
					</Button>
				</div>
			</main>
			<LandingFooter />
		</div>
	);
}
