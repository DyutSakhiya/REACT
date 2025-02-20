import { useState } from "react";

const Navbar2 = ({ setCountry }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
      <img
              src={'./public/clocklogo.jpg'}
              alt="TV9 News Logo"
              className="w-15 h-10 mx-5 object-cover"
            />
        <button 
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black mb-1"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </button>

        <div className={`${isOpen ? "block" : "hidden"} md:flex md:items-center w-full md:w-auto`}>
          <ul className="md:flex md:space-x-6 space-y-4 md:space-y-0 bg-gray-100 md:bg-transparent p-4 md:p-0">
            <li className="relative group pr-[1000px]">
              <a className="block text-gray-800 hover:text-gray-600 cursor-pointer">Countries</a>
              <ul className="absolute left-0 mt-2 w-48 bg-white shadow-md hidden group-hover:block">
              <li><a onClick={() => setCountry("India")} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">India</a></li>
                <li><a onClick={() => setCountry("US")} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Us</a></li>
                <li><a onClick={() => setCountry("France")} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">France</a></li>
                <li><a onClick={() => setCountry("England & Wales")} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">England & Wales</a></li>
                <li><a onClick={() => setCountry("Canada")} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Canada</a></li>
                <li><a onClick={() => setCountry("Singapore")} className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Singapore</a></li>
              </ul>
            </li>
          </ul>

          <form className="flex space-x-2 mt-4 md:mt-0">
            <input
              type="search"
              placeholder="Search"
              className="border border-gray-300 px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button className="px-3 py-1 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white">
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
