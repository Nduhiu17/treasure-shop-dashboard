import React from "react";

export default function LandingFooter() {
  return (
    <footer className="bg-gradient-to-br from-fuchsia-700 via-cyan-700 to-yellow-400 text-white py-10 px-4 mt-12 border-t-4 border-fuchsia-200 shadow-inner animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <img src="/logo.png" alt="Academic Codebase Logo" className="h-9 w-9 rounded-xl shadow-md border-2 border-white/30 bg-white/10" />
          <span className="font-extrabold text-xl tracking-tight text-yellow-200 drop-shadow">Academic Codebase</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-10 text-sm text-cyan-100">
          <a href="/about" className="hover:text-fuchsia-200 transition-colors font-semibold">About Us</a>
          <a href="/guarantees" className="hover:text-yellow-200 transition-colors font-semibold">Guarantees</a>
          <a href="/reviews" className="hover:text-cyan-200 transition-colors font-semibold">Reviews</a>
          <a href="/create-order" className="hover:text-fuchsia-200 transition-colors font-semibold">Order</a>
        </div>
        <div className="text-xs text-yellow-100 text-center md:text-right">
          <div>© {new Date().getFullYear()} Academic Codebase. All rights reserved.</div>
          <div className="mt-1">Made with <span className="text-rose-400">♥</span> for students worldwide.</div>
        </div>
      </div>
    </footer>
  );
}
