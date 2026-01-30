import React from 'react';
import { Link } from '@tanstack/react-router';
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 w-64 h-full bg-gray-800 shadow-lg p-0 transform transition-transform duration-300 top-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } z-50`}
      >
        <div className="flex justify-between items-center p-4">
          <div className="text-white text-2xl font-bold">App Name</div>
          <button onClick={onClose} className="text-gray-400 hover:text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <ul className="flex flex-col gap-2 p-2">
         
          <li>
            <Link href="/" className="flex items-center gap-2 p-2 bg-gray-700 text-white rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 p-2 text-white hover:bg-gray-700 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a42.043 42.043 0 011.055.772v3.136C21.171 13.91 20 14.825 20 16c0 1.375-3.003 2.13-7.5 2.13-4.498 0-7.5-1.042-7.5-2.13 0-1.175 1.171-2.09 3-2.926v-3.136a42.043 42.043 0 011.055-.772L12 14z" />
              </svg>
              Profile
            </a>
          </li>
          <li className="border-t border-gray-700 my-2"></li>
         
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
