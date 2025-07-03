import React from "react";

export default function LandingFooter() {
  return (
    <footer className="bg-blue-900 text-white py-8 px-4 mt-12 border-t border-blue-100">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <img src="/logo.png" alt="Academic Codebase Logo" className="h-8 w-8" />
          <span className="font-bold text-lg">Academic Codebase</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-blue-100">
          <a href="/about" className="hover:text-white transition-colors">About Us</a>
          <a href="/guarantees" className="hover:text-white transition-colors">Guarantees</a>
          <a href="/reviews" className="hover:text-white transition-colors">Reviews</a>
          <a href="/create-order" className="hover:text-white transition-colors">Order</a>
        </div>
        <div className="text-xs text-blue-200 text-center md:text-right">
          <div>© {new Date().getFullYear()} Academic Codebase. All rights reserved.</div>
          <div className="mt-1">Made with <span className="text-red-400">♥</span> for students worldwide.</div>
        </div>
      </div>
    </footer>
  );
}
