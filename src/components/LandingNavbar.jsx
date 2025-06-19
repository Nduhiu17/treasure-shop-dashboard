import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

const SERVICE_ITEMS = [
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

export default function LandingNavbar({ user, onLogout }) {
	const [servicesOpen, setServicesOpen] = React.useState(false);
	const [profileOpen, setProfileOpen] = React.useState(false);

	// Close dropdowns on outside click
	React.useEffect(() => {
		function handleClick(e) {
			if (!e.target.closest(".navbar-dropdown")) {
				setServicesOpen(false);
				setProfileOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	return (
		<header className="sticky top-0 z-40 w-full bg-white/90 shadow-sm border-b border-blue-100">
			<nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
				{/* Logo */}
				<Link
					to="/"
					className="flex items-center gap-2 text-blue-700 font-bold text-xl"
				>
					<img
						src="/favicon.ico"
						alt="Treasure Shop"
						className="h-8 w-8"
					/>
					Treasure Shop
				</Link>
				{/* Nav Items */}
				<ul className="hidden md:flex items-center gap-4 lg:gap-8">
					<li className="relative navbar-dropdown">
						<button
							className="flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-600 transition-colors"
							onMouseEnter={() => setServicesOpen(true)}
							onMouseLeave={() => setServicesOpen(false)}
							onClick={() => setServicesOpen((v) => !v)}
						>
							Services
							<svg
								className="w-4 h-4 ml-1"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>
						{servicesOpen && (
							<div
								className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-blue-100 py-2 z-50 animate-fade-in navbar-dropdown"
								onMouseEnter={() => setServicesOpen(true)}
								onMouseLeave={() => setServicesOpen(false)}
							>
								{SERVICE_ITEMS.map((item) => (
									<Link
										key={item}
										to={`/services/${encodeURIComponent(
											item.toLowerCase().replace(/\s+/g, "-")
										)}`}
										className="block px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm font-medium"
									>
										{item}
									</Link>
								))}
							</div>
						)}
					</li>
					<li>
						<Link
							to="/about"
							className="font-semibold text-blue-900 hover:text-blue-600 transition-colors"
						>
							About Us
						</Link>
					</li>
					<li>
						<Link
							to="/guarantees"
							className="font-semibold text-blue-900 hover:text-blue-600 transition-colors"
						>
							Guarantees
						</Link>
					</li>
					<li>
						<Link
							to="/reviews"
							className="font-semibold text-blue-900 hover:text-blue-600 transition-colors"
						>
							Reviews
						</Link>
					</li>
					<li>
						<a
							href="tel:+1234567890"
							className="font-semibold text-blue-900 hover:text-blue-600 transition-colors flex items-center gap-1"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 0v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z"
								/>
							</svg>
							+1 234 567 890
						</a>
					</li>
				</ul>
				{/* Order/Login/Profile Buttons */}
				<div className="flex items-center gap-2">
					<Button
						as={Link}
						to="/create-order"
						className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 px-4 py-2 rounded-lg"
					>
						Order
					</Button>
					{user ? (
						<div className="relative navbar-dropdown">
							<Button
								className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100"
								onClick={() => setProfileOpen((v) => !v)}
							>
								My Profile
								<svg
									className="w-4 h-4 ml-1"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</Button>
							{profileOpen && (
								<div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-blue-100 py-2 z-50 animate-fade-in navbar-dropdown">
									<div className="px-4 py-2 border-b border-blue-50">
										<div className="font-bold text-blue-900">
											{user.name || user.username}
										</div>
										<div className="text-xs text-gray-500">
											{user.email}
										</div>
									</div>
									<Link
										to="/dashboard/my-orders"
										className="block px-4 py-2 text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm font-medium"
									>
										All My Orders
									</Link>
									<button
										className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-medium"
										onClick={() => {
											setProfileOpen(false);
											if (onLogout) onLogout();
										}}
									>
										Logout
									</button>
								</div>
							)}
						</div>
					) : (
						<Button
							as={Link}
							to="/login"
							className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100"
						>
							Login
						</Button>
					)}
				</div>
			</nav>
		</header>
	);
}
