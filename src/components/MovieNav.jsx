import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function MovieNav() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg fixed w-full z-20 top-0 left-0">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-yellow-400">
              MovieHub
            </Link>
            <button className="md:hidden p-2">
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
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8 mt-4 md:mt-0">
            <Link
              to="/home"
              className="hover:text-yellow-400 transition duration-300"
            >
              Home
            </Link>
            <Link
              to="/bollywood"
              className="hover:text-yellow-400 transition duration-300"
            >
              Bollywood
            </Link>
            <Link
              to="/hollywood"
              className="hover:text-yellow-400 transition duration-300"
            >
              Hollywood
            </Link>

            <Link
              to="/web series"
              className="hover:text-yellow-400 transition duration-300"
            >
              Web Series
            </Link>
            <Link
              to="/gujarati"
              className="hover:text-yellow-400 transition duration-300"
            >
              Gujarati
            </Link>

            <form onSubmit={handleSearch} className="relative ml-4">
              <input
                type="search"
                placeholder="Search movies..."
                className="px-4 py-2 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                <Search size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default MovieNav;
