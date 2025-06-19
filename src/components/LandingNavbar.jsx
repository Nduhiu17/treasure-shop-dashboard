import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import LoginPage from "../features/auth/LoginPage";
import CreateOrder from "../features/orders/CreateOrder";
import { Dialog } from "./ui/dialog";

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
	const [profileOpen, setProfileOpen] = React.useState(false); // profile dropdown
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false); // mobile menu
	const [mobileMenuServicesOpen, setMobileMenuServicesOpen] = React.useState(false);
	const [loginModalOpen, setLoginModalOpen] = React.useState(false);
	const [pendingOrder, setPendingOrder] = React.useState(false);
	const [createOrderModalOpen, setCreateOrderModalOpen] = React.useState(false);
	const mobileMenuButtonRef = React.useRef();
	const mobileMenuRef = React.useRef();
	const profileButtonRef = React.useRef();
	const profileDropdownRef = React.useRef();
	const navigate = useNavigate();

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

	// Close profile dropdown on outside click
	React.useEffect(() => {
		function handleClick(e) {
			if (profileOpen && profileDropdownRef.current && !profileDropdownRef.current.contains(e.target) && !profileButtonRef.current.contains(e.target)) {
				setProfileOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [profileOpen]);

	// Close profile dropdown on Escape
	React.useEffect(() => {
		function handleKeyDown(e) {
			if (e.key === 'Escape') setProfileOpen(false);
		}
		if (profileOpen) document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [profileOpen]);

	// Handler for all "Order" buttons in navbar
	const handleOrderClick = (e) => {
		e?.preventDefault?.();
		if (user) {
			setCreateOrderModalOpen(true);
		} else {
			setPendingOrder(true);
			setLoginModalOpen(true);
		}
	};

	// After successful login
	const handleLoginSuccess = () => {
		setLoginModalOpen(false);
		if (pendingOrder) {
			setPendingOrder(false);
			setCreateOrderModalOpen(true);
		}
	};

	return (
		<header className="sticky top-0 z-50 w-full bg-white md:bg-white/95 md:backdrop-blur-md shadow-xl border-b border-blue-100">
			<nav className="w-full flex items-center justify-between px-2 xs:px-4 py-2 xs:py-3 rounded-b-2xl bg-white md:bg-gradient-to-r md:from-blue-50/95 md:via-white/95 md:to-blue-100/95 shadow-lg">
				<div className="w-full max-w-7xl mx-auto flex items-center justify-between">
					{/* Logo */}
					<Link
						to="/"
						className="flex items-center gap-2 text-blue-700 font-extrabold text-2xl tracking-tight drop-shadow-sm hover:scale-105 transition-transform duration-200"
						style={{ letterSpacing: '0.01em' }}
					>
						<img
							src="/favicon.ico"
							alt="Academic Codebase Logo"
							className="h-10 w-10 rounded-xl shadow-md border border-blue-200 bg-white/80"
						/>
						<span className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 bg-clip-text text-transparent">Academic Codebase</span>
					</Link>
					{/* Desktop Nav Items */}
					<ul className="hidden md:flex items-center gap-4 lg:gap-8">
						<li className="relative navbar-dropdown">
							<button
								className="flex items-center gap-2 font-semibold text-blue-900 hover:text-blue-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-100/80 to-blue-200/80 shadow-md border border-blue-100 hover:shadow-xl hover:from-blue-200 hover:to-blue-300"
								onMouseEnter={() => setServicesDropdownOpen(true)}
								onMouseLeave={() => setServicesDropdownOpen(false)}
								onClick={() => setServicesDropdownOpen((v) => !v)}
								aria-haspopup="true"
								aria-expanded={servicesDropdownOpen}
							>
								Services
								<svg
									className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
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
									className="absolute left-0 mt-2 w-[95vw] max-w-2xl sm:max-w-3xl bg-white/95 rounded-2xl shadow-2xl border border-blue-100 py-6 px-4 z-50 animate-fade-in navbar-dropdown backdrop-blur-xl"
									onMouseEnter={() => setServicesDropdownOpen(true)}
									onMouseLeave={() => setServicesDropdownOpen(false)}
								>
									<h4 className="text-lg font-bold text-blue-900 mb-4 px-2">Our Services</h4>
									<div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
										{chunkArray(SERVICE_ITEMS, 3).map((col, colIdx) => (
											<div key={colIdx} className="flex flex-col gap-1">
												{col.map((item) => (
													<Link
														key={item}
														to={`/services/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, "-"))}`}
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
								className="font-semibold text-blue-900 hover:text-blue-600 transition-colors px-3 py-2 rounded-xl hover:bg-blue-50/80"
							>
								About Us
							</Link>
						</li>
						<li>
							<Link
								to="/guarantees"
								className="font-semibold text-blue-900 hover:text-blue-600 transition-colors px-3 py-2 rounded-xl hover:bg-blue-50/80"
							>
								Guarantees
							</Link>
						</li>
						<li>
							<Link
								to="/reviews"
								className="font-semibold text-blue-900 hover:text-blue-600 transition-colors px-3 py-2 rounded-xl hover:bg-blue-50/80"
							>
								Reviews
							</Link>
						</li>
						<li>
							<a
								href="tel:+1234567890"
								className="font-semibold text-blue-900 hover:text-blue-600 transition-colors flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-blue-50/80"
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
					{/* Mobile menu button - improved for small screens */}
					<div className="md:hidden flex items-center">
						<button
							ref={mobileMenuButtonRef}
							className="p-3 rounded-2xl text-blue-700 bg-white/80 shadow-lg border border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 active:scale-95"
							aria-label="Open menu"
							onClick={() => setMobileMenuOpen(true)}
							style={{ boxShadow: '0 4px 24px 0 rgba(30, 64, 175, 0.10)' }}
						>
							<svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
						</button>
					</div>
				</div>
				{/* Mobile menu (side drawer) - improved animation and style */}
				{mobileMenuOpen && (
					<div className="fixed inset-0 z-50 bg-black/40 flex md:hidden navbar-mobile-menu" onClick={() => setMobileMenuOpen(false)}>
						<div
							ref={mobileMenuRef}
							className="relative bg-white/95 w-11/12 max-w-xs h-full shadow-2xl p-6 flex flex-col gap-6 animate-slide-in-left rounded-r-3xl border-l-4 border-blue-100"
							onClick={e => e.stopPropagation()}
							tabIndex={-1}
							style={{ minWidth: '260px', maxWidth: '90vw', boxShadow: '0 8px 32px 0 rgba(30, 64, 175, 0.18)' }}
						>
							<button
								className="absolute top-4 right-4 text-blue-400 hover:text-blue-700 text-2xl font-bold focus:outline-none transition-colors"
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
										<Button as={Link} to="/profile" className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 mt-2 min-w-0 max-w-full overflow-hidden truncate" onClick={() => setMobileMenuOpen(false)}>
											<span className="block truncate">My Profile</span>
										</Button>
										<Button
											className="bg-red-50 text-red-700 font-semibold px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 mt-2"
											onClick={() => {
												setMobileMenuOpen(false);
												if (onLogout) onLogout();
												navigate('/');
											}}
										>
											Logout
										</Button>
									</>
								) : (
									<Button
										className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 mt-2"
										onClick={() => {
											setMobileMenuOpen(false);
											navigate('/login');
										}}
									>
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
						onClick={handleOrderClick}
						className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow hover:from-green-600 hover:to-green-700 px-4 py-2 rounded-lg"
					>
						Order
					</Button>
					{user ? (
						<div className="relative">
							<Button
								ref={profileButtonRef}
								className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 flex items-center gap-2"
								onClick={() => setProfileOpen((v) => !v)}
								aria-haspopup="true"
								aria-expanded={profileOpen}
							>
								<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
								My Profile
								<svg className={`w-4 h-4 ml-1 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
							</Button>
							{profileOpen && (
								<div ref={profileDropdownRef} className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-blue-100 py-4 px-6 z-50 animate-fade-in navbar-dropdown backdrop-blur-xl">
									<div className="mb-2 flex items-center gap-3">
										<svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2" /></svg>
										<div>
											<div className="font-bold text-blue-900 text-lg">{user.first_name || user.username || user.email}</div>
											<div className="text-blue-700 text-sm">{user.email}</div>
										</div>
									</div>
									<Button className="w-full bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 mt-2" onClick={() => { setProfileOpen(false); window.location.href = 'http://localhost:3000/profile'; }}>My Orders</Button>
									<hr className="my-2 border-blue-100" />
									<Button className="w-full bg-red-50 text-red-700 font-semibold px-4 py-2 rounded-lg border border-red-100 hover:bg-red-100 mt-2" onClick={() => { setProfileOpen(false); if (onLogout) onLogout(); navigate('/'); }}>Logout</Button>
								</div>
							)}
						</div>
					) : (
						<Button
							className="bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100"
							onClick={() => setLoginModalOpen(true)}
						>
							Login
						</Button>
					)}
				</div>
			</nav>
			{/* Login Modal */}
			{loginModalOpen && (
				<Dialog isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} title="Login">
					<LoginPage asModal onSuccess={handleLoginSuccess} />
				</Dialog>
			)}
			{/* Create Order Modal */}
			{createOrderModalOpen && (
				<Dialog isOpen={createOrderModalOpen} onClose={() => setCreateOrderModalOpen(false)} title="Create Order">
					<CreateOrder />
				</Dialog>
			)}
		</header>
	);
}

/* Add this to your global CSS or Tailwind config for the animation:
@keyframes slide-in-left {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
.animate-slide-in-left {
  animation: slide-in-left 0.35s cubic-bezier(0.4,0,0.2,1) both;
}
*/
