import React from "react";
import { Link } from "react-router-dom";



function MovieNav() {
  return (
    <div>
      <nav className="bg-gray-100 shadow-md fixed w-full z-20 top-0 left-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-10">
              <a href="#" className="text-xl font-semibold text-gray-800">
                Navbar
              </a>

              <div className="hidden md:flex items-center space-x-6">
                <Link to="/Home" className="text-gray-800 hover:text-blue-600">
                  Home
                </Link>
                <Link to="/Bollywood" className="text-gray-800 hover:text-blue-600">
                  Bollywood
                </Link>
                <Link to="/Hollywood" className="text-gray-800 hover:text-blue-600">
                  Hollywood
                </Link>

                <div className="relative group">
                  <button className="text-gray-800 hover:text-blue-600 focus:outline-none">
                    More
                  </button>
                  <ul className="absolute left-0 hidden group-hover:block bg-white border mt-2 rounded shadow-md w-40 z-20">
                    <li>
                      <Link to="/Gujarati" className="block px-4 py-2 hover:bg-gray-100">
                        Gujarati
                      </Link>
                    </li>
                    <li>
                      <Link to="Web Series" className="block px-4 py-2 hover:bg-gray-100">
                        Web Series
                      </Link>
                    </li>
                   
                  </ul>
                </div>
              </div>
            </div>

            <form className="flex items-center space-x-2" role="search">
              <input
                type="search"
                placeholder="Search"
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="px-3 py-1 border border-green-500 text-green-600 rounded hover:bg-green-100"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default MovieNav;
