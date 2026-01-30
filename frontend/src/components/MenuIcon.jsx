import React from "react";

export function MenuIcon({ onClick }) {
  return (
    <button
      className="fixed top-6 left-6 z-50 p-2 bg-white rounded-full shadow hover:bg-gray-100 focus:outline-none"
      onClick={onClick}
      aria-label="Open sidebar"
      type="button"
    >
      {/* Hamburger SVG icon */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}
