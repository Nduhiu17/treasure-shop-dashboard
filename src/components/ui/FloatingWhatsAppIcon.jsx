import React from "react";

const FloatingWhatsAppIcon = () => (
  <a
    href="https://wa.me/254106793974"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-20 sm:bottom-6 right-6 z-50 p-3 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-75"
    title="Chat with us on WhatsApp"
    style={{ boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)' }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M.999 23.003L2.73 17.65a8.97 8.97 0 01-1.34-4.887C1.39 6.84 6.84 1.39 13.007 1.39c3.08 0 5.96 1.2 8.16-3.393s3.39 5.08 3.39 8.16a8.97 8.97 0 01-1.34 4.887L23.003 23.003l-5.353-1.73a9.003 9.003 0 01-4.887 1.34c-6.16 0-11.61-5.45-11.61-11.61a8.97 8.97 0 011.34-4.887L.999 0 .999 23.003zM13.007 3.39c-5.06 0-9.21 4.15-9.21 9.21 0 1.95.6 3.76 1.63 5.25L3.447 21.55l3.227-1.047a7.22 7.22 0 004.887 1.34h.01c5.06 0 9.21-4.15 9.21-9.21s-4.15-9.21-9.21-9.21zM17.007 15.61c-.24 0-.48-.07-.69-.14l-1.92-1.22c-.14-.08-.3-.1-.45-.04l-1.12.35c-.24.08-.5.06-.72-.05-.23-.1-.4-.28-.5-.5l-.35-1.12c-.06-.15-.04-.31.04-.45l1.22-1.92c.07-.21.0-2.07-2.06-2.07-.24 0-.48-.07-.69-.14l-1.92-1.22c-.14-.08-.3-.1-.45-.04l-1.12.35c-.24.08-.5.06-.72-.05-.23-.1-.4-.28-.5-.5l-.35-1.12c-.06-.15-.04-.31.04-.45l1.22-1.92c.07-.21.0-2.07-2.06-2.07" />
    </svg>
  </a>
);

export default FloatingWhatsAppIcon;
