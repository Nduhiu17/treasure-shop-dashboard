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

function chunkArray(array, chunkCount) {
	const perChunk = Math.ceil(array.length / chunkCount);
	return Array.from({ length: chunkCount }, (_, i) =>
		array.slice(i * perChunk, (i + 1) * perChunk)
	);
}

export default function LandingNavbar({ user, onLogout }) {
	const [servicesDropdownOpen, setServicesDropdownOpen] = React.useState(false); // desktop dropdown
	const [profileOpen, setProfileOpen] = React.useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false); // mobile menu
	const [mobileMenuServicesOpen, setMobileMenuServicesOpen] = React.useState(false);
	const mobileMenuButtonRef = React.useRef();
	const mobileMenuRef = React.useRef();

	// Improved: Close mobile menu on route change or resize
	React.useEffect(() => {
		function handleResize() {
			if (window.innerWidth >= 768) setMobileMenuOpen(false);
		}
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	React.useEffect(() => {
		function handleRouteChange() {
			setMobileMenuOpen(false);
		}
		window.addEventListener('popstate', handleRouteChange);
		return () => window.removeEventListener('popstate', handleRouteChange);
	}, []);

	// Trap focus in mobile menu for accessibility
	React.useEffect(() => {
		if (!mobileMenuOpen) return;
		const drawer = mobileMenuRef.current;
		if (!drawer) return;
		const focusable = drawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
		if (focusable.length) focusable[0].focus();
		function handleKeyDown(e) {
			if (e.key === 'Escape') setMobileMenuOpen(false);
			if (e.key === 'Tab' && focusable.length) {
				const first = focusable[0];
				const last = focusable[focusable.length - 1];
				if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
					e.preventDefault();
					(e.shiftKey ? last : first).focus();
				}
			}
		}
		drawer.addEventListener('keydown', handleKeyDown);
		return () => drawer.removeEventListener('keydown', handleKeyDown);
	}, [mobileMenuOpen]);

	// Close dropdowns on outside click (desktop only)
	React.useEffect(() => {
		function handleClick(e) {
			if (!e.target.closest('.navbar-dropdown')) {
				setServicesDropdownOpen(false);
				setProfileOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
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
							className="flex items-center gap-1 font-semibold text-blue-900 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm"
							onMouseEnter={() => setServicesDropdownOpen(true)}
							onMouseLeave={() => setServicesDropdownOpen(false)}
							onClick={() => setServicesDropdownOpen((v) => !v)}
							aria-haspopup="true"
							aria-expanded={servicesDropdownOpen}
						>
							<span className="flex items-center gap-2">
								Services
							</span>
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
						{servicesDropdownOpen && (
							<div
								className="absolute left-0 mt-2 w-[95vw] max-w-2xl sm:max-w-3xl bg-white rounded-2xl shadow-2xl border border-blue-100 py-6 px-4 z-50 animate-fade-in navbar-dropdown"
								onMouseEnter={() => setServicesDropdownOpen(true)}
								onMouseLeave={() => setServicesDropdownOpen(false)}
							>
								<h4 className="text-lg font-bold text-blue-900 mb-4 px-2">
									Our Services
								</h4>
								<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
									{chunkArray(SERVICE_ITEMS, 3).map((col, colIdx) => (
										<div key={colIdx} className="flex flex-col gap-1">
											{col.map((item) => (
												<Link
													key={item}
													to={`/services/${encodeURIComponent(
														item.toLowerCase().replace(/\s+/g, "-")
													)}`}
													className="flex items-center gap-2 px-4 py-2 rounded-lg text-blue-900 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 transition-colors text-sm font-medium shadow-sm group"
												>
													<span className="inline-block w-2 h-2 rounded-full bg-blue-400 group-hover:bg-blue-600 transition-colors"></span>
													<span className="truncate">{item}</span>
													<svg
														className="w-4 h-4 text-blue-200 group-hover:text-blue-500 ml-auto"
														fill="none"
														stroke="currentColor"
														strokeWidth="2"
														viewBox="0 0 24 24"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M9 5l7 7-7 7"
														/>
													</svg>
												</Link>
											))}
										</div>
									))}
								</div>
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
				{/* Mobile menu button */}
				<div className="md:hidden flex items-center">
					<button
						ref={mobileMenuButtonRef}
						className="p-2 rounded-lg text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
						aria-label="Open menu"
						onClick={() => setMobileMenuOpen(true)}
					>
						<svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
					</button>
				</div>
				{/* Mobile dropdown menu (full menu, not just services) */}
				{mobileMenuOpen && (
					<div className="fixed inset-0 z-50 bg-black/40 flex md:hidden navbar-mobile-menu" onClick={() => setMobileMenuOpen(false)}>
						<div
							ref={mobileMenuRef}
							className="relative bg-white w-11/12 max-w-xs h-full shadow-2xl p-6 flex flex-col gap-6 animate-fade-in-left"
							onClick={e => e.stopPropagation()}
							tabIndex={-1}
						>
							<button
								className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl font-bold focus:outline-none"
								onClick={() => setMobileMenuOpen(false)}
								aria-label="Close menu"
							>
								&times;
							</button>
							<h4 className="text-lg font-bold text-blue-900 mb-2">Menu</h4>
							<div className="flex flex-col gap-2">
								<button
									className="flex items-center justify-between px-3 py-2 rounded-lg text-blue-900 hover:bg-blue-50 hover:text-blue-700 text-base font-medium focus:outline-none"
									onClick={() => setMobileMenuServicesOpen(v => !v)}
									aria-expanded={mobileMenuServicesOpen}
									aria-controls="mobile-services-list"
								>
									<span className="text-blue-700 font-semibold">Services</span>
									<svg className={`w-5 h-5 ml-2 transition-transform ${mobileMenuServicesOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
								</button>
								{mobileMenuServicesOpen && (
									<div id="mobile-services-list" className="flex flex-col gap-1 pl-4 max-h-64 overflow-y-auto">
										{SERVICE_ITEMS.map(item => (
											<Link
												key={item}
												to={`/services/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, "-"))}`}
												className="block px-3 py-2 rounded-lg text-blue-900 hover:bg-blue-50 hover:text-blue-700 text-base font-medium"
												onClick={() => setMobileMenuOpen(false)}
											>
												{item}
											</Link>
										))}
									</div>
								)}
							</div>
							<div className="flex flex-col gap-2 mt-4">
								<Link to="/about" className="block px-3 py-2 rounded-lg text-blue-900 hover:bg-blue-50 hover:text-blue-700 text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
									About Us
								</Link>
								<Link to="/guarantees" className="block px-3 py-2 rounded-lg text-blue-900 hover:bg-blue-50 hover:text-blue-700 text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
									Guarantees
								</Link>
								<Link to="/reviews" className="block px-3 py-2 rounded-lg text-blue-900 hover:bg-blue-50 hover:text-blue-700 text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
									Reviews
								</Link>
								<a href="tel:+1234567890" className="block px-3 py-2 rounded-lg text-blue-900 hover:bg-blue-50 hover:text-blue-700 text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
									<span className="flex items-center gap-2">
										<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 0v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z" /></svg>
										+1 234 567 890
									</span>
								</a>
								{user ? (
									<>
										<Button as={Link} to="/create-order" className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow px-4 py-2 rounded-lg mt-2" onClick={() => setMobileMenuOpen(false)}>
											Order
										</Button>
										<Button as={Link} to="/profile" className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 mt-2" onClick={() => setMobileMenuOpen(false)}>
											My Profile
										</Button>
										<Button className="bg-red-50 text-red-700 font-semibold px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 mt-2" onClick={() => { setMobileMenuOpen(false); onLogout && onLogout(); }}>
											Logout
										</Button>
									</>
								) : (
									<Button as={Link} to="/login" className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 mt-2" onClick={() => setMobileMenuOpen(false)}>
										Login
									</Button>
								)}
							</div>
						</div>
					</div>
				)}
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
