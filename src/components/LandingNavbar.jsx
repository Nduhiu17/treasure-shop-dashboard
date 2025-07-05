import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import CreateOrder from "../features/orders/CreateOrder";
// import PayPalModal from "../features/orders/PayPalModal"; // Removed: PayPal flow deprecated
import { Dialog } from "./ui/dialog";
import { WideDialog } from "../components/ui/wide-dialog";

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
	const [registerModalOpen, setRegisterModalOpen] = React.useState(false);
	const [pendingOrder, setPendingOrder] = React.useState(false);
	const [createOrderModalOpen, setCreateOrderModalOpen] = React.useState(false);
// const [payPalModalOpen, setPayPalModalOpen] = React.useState(false); // Removed: PayPal flow deprecated
	const [payPalOrderId, setPayPalOrderId] = React.useState(null);
	const [payPalAmount, setPayPalAmount] = React.useState(null);
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
	const handleOrderButton = (e) => {
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

	const handleOrderCreated = (orderId, amount) => {
		setCreateOrderModalOpen(false);
		setTimeout(() => {
			setPayPalOrderId(orderId);
			setPayPalAmount(amount);
// setPayPalModalOpen(true); // Removed: PayPal flow deprecated
		}, 300);
	};

	// Pass this to LoginPage so it can trigger register modal
	const handleOpenRegister = () => {
		setLoginModalOpen(false);
		setTimeout(() => setRegisterModalOpen(true), 200); // slight delay for smooth transition
	};

  return (
	<header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-2xl border-b-4 border-fuchsia-200 rounded-b-3xl animate-fade-in-up">
	  <nav className="w-full flex items-center justify-between px-2 xs:px-4 py-2 xs:py-3 rounded-b-3xl bg-white/95 shadow-lg">
		<div className="w-full max-w-7xl mx-auto flex items-center justify-between">
		  {/* Logo */}
		  <Link
			to="/"
			className="flex items-center gap-3 text-fuchsia-700 font-extrabold text-2xl tracking-tight drop-shadow-sm hover:scale-105 transition-transform duration-200"
			style={{ letterSpacing: '0.01em' }}
		  >
			<img
			  src="/logo.png"
			  alt="Academic Codebase Logo"
			  className="h-11 w-11 rounded-2xl shadow-md border-2 border-fuchsia-200 bg-white/80"
			/>
			<span className="bg-gradient-to-r from-fuchsia-700 via-cyan-500 to-yellow-400 bg-clip-text text-transparent">Academic Codebase</span>
		  </Link>
		  {/* Desktop Nav Items */}
		  <ul className="hidden md:flex items-center gap-6 lg:gap-10 uppercase font-bold tracking-wide text-base">
			<li className="relative navbar-dropdown">
			  <button
				className="flex items-center gap-2 font-bold text-fuchsia-700 hover:text-cyan-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 px-5 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-50 to-cyan-50 shadow border-2 border-fuchsia-100 hover:shadow-xl hover:from-fuchsia-100 hover:to-cyan-100"
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
				  className="absolute left-0 mt-2 w-[95vw] max-w-2xl sm:max-w-3xl bg-white/95 rounded-2xl shadow-2xl border-2 border-fuchsia-100 py-6 px-4 z-50 animate-fade-in navbar-dropdown backdrop-blur-xl"
				  onMouseEnter={() => setServicesDropdownOpen(true)}
				  onMouseLeave={() => setServicesDropdownOpen(false)}
				>
				  <h4 className="text-lg font-bold text-fuchsia-700 mb-4 px-2">Our Services</h4>
				  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
					{chunkArray(SERVICE_ITEMS, 3).map((col, colIdx) => (
					  <div key={colIdx} className="flex flex-col gap-1">
						{col.map((item) => (
						  <Link
							key={item}
							to={`/services/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, "-"))}`}
							className="flex items-center gap-2 px-4 py-2 rounded-lg text-fuchsia-700 hover:bg-gradient-to-r hover:from-fuchsia-100 hover:to-cyan-100 hover:text-cyan-700 transition-colors text-sm font-medium shadow-sm group"
						  >
							<span className="inline-block w-2 h-2 rounded-full bg-cyan-400 group-hover:bg-fuchsia-400 transition-colors"></span>
							<span className="truncate">{item}</span>
							<svg
							  className="w-4 h-4 text-cyan-200 group-hover:text-fuchsia-500 ml-auto"
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
				className="font-bold text-cyan-700 hover:text-fuchsia-600 transition-colors px-4 py-2 rounded-2xl hover:bg-cyan-50"
			  >
				About Us
			  </Link>
			</li>
			<li>
			  <Link
				to="/guarantees"
				className="font-bold text-yellow-600 hover:text-fuchsia-700 transition-colors px-4 py-2 rounded-2xl hover:bg-yellow-50"
			  >
				Guarantees
			  </Link>
			</li>
			<li>
			  <Link
				to="/reviews"
				className="font-bold text-fuchsia-700 hover:text-cyan-700 transition-colors px-4 py-2 rounded-2xl hover:bg-fuchsia-50"
			  >
				Reviews
			  </Link>
			</li>
			<li>
			  <a
				href="tel:+1234567890"
				className="font-bold text-cyan-700 hover:text-fuchsia-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-cyan-50"
			  >
				<svg
				  className="w-5 h-5 text-yellow-400"
				  fill="currentColor"
				  viewBox="0 0 20 20"
				>
				  <path d="M2.003 5.884l2-3.5A2 2 0 016.605 1h6.79a2 2 0 011.732.884l2 3.5A2 2 0 0118 7.118V17a2 2 0 01-2 2H4a2 2 0 01-2-2V7.118a2 2 0 01.003-1.234z" />
				</svg>
				+1 234 567 890
			  </a>
			</li>
		  </ul>
		  {/* Mobile menu button */}
		  {/* World-class mobile-first hamburger menu button */}
		  {/* Modern mobile-first hamburger menu button and drawer */}
		  <div className="md:hidden flex items-center">
			<button
			  ref={mobileMenuButtonRef}
			  aria-label="Open menu"
			  onClick={e => { e.stopPropagation(); setMobileMenuOpen(true); }}
			  className="relative z-50 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-600 via-cyan-400 to-yellow-300 shadow-2xl border-2 border-fuchsia-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-300 transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
			>
			  <span className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-200 via-cyan-100 to-yellow-100 opacity-80 blur-lg animate-pulse"></span>
			  <span className="relative block w-8 h-1.5 rounded-full bg-white mb-2 transition-all duration-300 group-hover:bg-yellow-200 group-hover:w-9"></span>
			  <span className="relative block w-6 h-1.5 rounded-full bg-white mb-2 transition-all duration-300 group-hover:bg-cyan-200 group-hover:w-7"></span>
			  <span className="relative block w-4 h-1.5 rounded-full bg-white transition-all duration-300 group-hover:bg-fuchsia-200 group-hover:w-5"></span>
			  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 via-fuchsia-200 to-cyan-200 rounded-full blur-md opacity-70 animate-pulse"></span>
			</button>
		  </div>
		</div>
				{/* Mobile menu (side drawer) - improved animation and style */}
	  {mobileMenuOpen && (
		  <div className="fixed inset-0 z-[99999] flex md:hidden navbar-mobile-menu" style={{ position: 'fixed', height: 'fit-content', maxHeight: '100vh', background: 'radial-gradient(circle at 70% 10%, #f0abfc 0%, #67e8f9 40%, #fef08a 100%)' }} onClick={() => setMobileMenuOpen(false)}>
			  <div
				  ref={mobileMenuRef}
				  className="relative w-full h-full bg-white/95 shadow-2xl p-0 flex flex-col animate-fade-in rounded-none border-none"
				  onClick={e => e.stopPropagation()}
				  tabIndex={-1}
				  style={{ minWidth: 0, maxWidth: '100vw', boxShadow: '0 8px 32px 0 rgba(236, 72, 153, 0.12)' }}
			  >
				  {/* Modern top bar with close button */}
				  <div className="flex items-center justify-between px-6 py-5 border-b border-fuchsia-100 bg-gradient-to-r from-fuchsia-50 via-cyan-50 to-yellow-50 shadow-sm">
					  <span className="text-xl font-extrabold text-fuchsia-700 tracking-wide">Menu</span>
					  <button
						  className="text-fuchsia-400 hover:text-fuchsia-700 text-3xl font-bold focus:outline-none transition-colors rounded-full p-2 hover:bg-fuchsia-100"
						  onClick={() => setMobileMenuOpen(false)}
						  aria-label="Close menu"
					  >
						  &times;
					  </button>
				  </div>
	  <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-3 text-base font-semibold">
		{/* Main nav items for mobile menu, card-like backgrounds, no logo */}
		<div className="flex flex-col gap-3">
		  <div className="rounded-xl bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-yellow-50 shadow border border-fuchsia-100">
			<button
			  className="w-full px-3 py-2 text-fuchsia-700 font-bold hover:text-cyan-600 transition-colors text-left flex items-center justify-between"
			  onClick={() => setMobileMenuServicesOpen(v => !v)}
			  aria-expanded={mobileMenuServicesOpen}
			  aria-controls="mobile-services-list"
			>
			  <span>Services</span>
			  <svg className={`w-4 h-4 ml-2 transition-transform ${mobileMenuServicesOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
			</button>
			{mobileMenuServicesOpen && (
			  <div id="mobile-services-list" className="mt-1 ml-2 rounded bg-white/95 border border-fuchsia-100 shadow p-1 max-h-60 overflow-y-auto absolute left-0 w-[90vw] z-[10000]">
				<h4 className="text-sm font-bold text-fuchsia-700 mb-1 px-2">Our Services</h4>
				<div className="grid grid-cols-1 xs:grid-cols-2 gap-0.5">
				  {SERVICE_ITEMS.map(item => (
					<Link
					  key={item}
					  to={`/services/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, "-"))}`}
					  className="px-2 py-1 text-fuchsia-700 hover:text-cyan-700 transition-colors text-xs font-medium"
					  onClick={() => setMobileMenuOpen(false)}
					>
					  <span className="truncate">{item}</span>
					</Link>
				  ))}
				</div>
			  </div>
			)}
		  </div>
		  <Link to="/about" className="rounded-xl bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-yellow-50 shadow border border-fuchsia-100 px-3 py-2 text-fuchsia-700 hover:text-cyan-600 transition-colors block" onClick={() => setMobileMenuOpen(false)}>
			About Us
		  </Link>
		  <Link to="/guarantees" className="rounded-xl bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-yellow-50 shadow border border-fuchsia-100 px-3 py-2 text-cyan-700 hover:text-fuchsia-700 transition-colors block" onClick={() => setMobileMenuOpen(false)}>
			Guarantees
		  </Link>
		  <Link to="/reviews" className="rounded-xl bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-yellow-50 shadow border border-fuchsia-100 px-3 py-2 text-yellow-700 hover:text-fuchsia-700 transition-colors block" onClick={() => setMobileMenuOpen(false)}>
			Reviews
		  </Link>
		  <a href="tel:+1234567890" className="rounded-xl bg-gradient-to-br from-fuchsia-50 via-cyan-50 to-yellow-50 shadow border border-fuchsia-100 px-3 py-2 text-cyan-700 hover:text-fuchsia-700 transition-colors block" onClick={() => setMobileMenuOpen(false)}>
			+1 234 567 890
		  </a>
		  {user ? (
			<>
			  <Link to="/my-orders" className="rounded-xl bg-gradient-to-br from-green-50 via-cyan-50 to-yellow-50 shadow border border-green-100 px-3 py-2 text-green-700 hover:text-green-900 transition-colors block" onClick={() => setMobileMenuOpen(false)}>
				My Orders
			  </Link>
			  <Link to="/profile" className="rounded-xl bg-gradient-to-br from-blue-50 via-cyan-50 to-yellow-50 shadow border border-blue-100 px-3 py-2 text-blue-700 hover:text-blue-900 transition-colors block" onClick={() => setMobileMenuOpen(false)}>
				My Profile
			  </Link>
			  <button
				className="w-full rounded-xl bg-gradient-to-br from-red-50 via-cyan-50 to-yellow-50 shadow border border-red-100 px-3 py-2 text-red-700 hover:text-red-900 transition-colors text-left"
				onClick={() => { setMobileMenuOpen(false); if (onLogout) onLogout(); navigate('/'); }}
			  >
				Logout
			  </button>
			</>
		  ) : (
			<Link
			  to="/login"
			  className="rounded-xl bg-gradient-to-br from-blue-50 via-cyan-50 to-yellow-50 shadow border border-blue-100 px-3 py-2 text-blue-700 hover:text-blue-900 transition-colors block"
			  onClick={() => setMobileMenuOpen(false)}
			>
			  Login
			</Link>
		  )}
		</div>
	  </nav>
					   </div>
				   </div>
			   )}
				{/* Order/Login/Profile Buttons */}
			   {/* Hide Order and My Profile on navbar for small screens, only show on md+ */}
			   <div className="hidden md:flex items-center gap-2">
			   <Button
				   onClick={() => {
					 if (user) {
					   navigate('/order/new');
					 } else {
					   setPendingOrder(true);
					   setLoginModalOpen(true);
					 }
				   }}
				   className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold shadow-lg hover:from-green-600 hover:to-green-700 px-8 py-3 text-lg rounded-xl"
			   >
				   Order Now
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
								   <Button className="w-full bg-blue-50 text-blue-900 font-semibold px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 mt-2" onClick={() => { setProfileOpen(false); navigate('/my-orders'); }}>My Orders</Button>
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
					<LoginPage asModal onSuccess={handleLoginSuccess} onClose={() => setLoginModalOpen(false)} onOpenRegister={handleOpenRegister} />
				</Dialog>
			)}
			{/* Register Modal */}
			{registerModalOpen && (
				<Dialog isOpen={registerModalOpen} onClose={() => setRegisterModalOpen(false)} title="Register">
					<RegisterPage open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} onSwitchToLogin={() => { setRegisterModalOpen(false); setTimeout(() => setLoginModalOpen(true), 200); }} asModal />
				</Dialog>
			)}
		   {/* Create Order Modal (no longer used for navbar/hero Order Now) */}
{/* PayPalModal removed: PayPal flow deprecated */}
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
