import React, { useState } from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggle = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  return (
    <div>
      <nav className="bg-gray-500 border-b border-gray-950 h-16">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center mt-3 space-x-6">
            <img
              src={'./public/TV9_india.jpg'}
              alt="TV9 News Logo"
              className="w-15 h-10 mx-5 object-cover"
            />
            <button
              className="text-gray-800 lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Toggle navigation"
              onClick={handleToggle}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
            <ul
              className={`${
                isMenuOpen ? 'block' : 'hidden'
              } lg:flex items-center space-x-6 absolute lg:static bg-gray-500 bg-opacity-80 lg:bg-transparent lg:w-full top-16 lg:top-0 z-10 lg:z-auto rounded-lg`}
            >
              <li>
                <Link to="/Home" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/About Us" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/Business" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/Entertainment" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  Entertainment
                </Link>
              </li>
              <li>
                <Link to="/General" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  General
                </Link>
              </li>
              <li>
                <Link to="/Health" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  Health
                </Link>
              </li>
              <li>
                <Link to="/Science" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  Science
                </Link>
              </li>
              <li>
                <Link to="/Sports" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  Sports
                </Link>
              </li>
              <li>
                <Link to="/Technology" className="text-gray-950 hover:text-white block px-4 py-2 lg:px-0">
                  Technology
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex space-x-3 items-center mr-5 mt-3">
            <input
              type="text"
              placeholder="Search"
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              News Search
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
