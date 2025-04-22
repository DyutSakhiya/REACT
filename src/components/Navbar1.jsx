import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react"; 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-100 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center ">
        <img
          src={"./public/logo.png"}
          alt=""
          className="w-16 h-12 mx-4 object-cover"
        />
        <button
          className="text-gray-600 md:hidden flex justify-end items-end "
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center w-full md:w-auto`}
        >
          <ul className="md:flex space-y-2 md:space-y-0 md:space-x-4 mr-48">
            <li>
              <Link className="text-gray-700 hover:text-gray-900" to="/home">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-gray-700 hover:text-gray-900" to="/t-shirt">
                T-Shirt
              </Link>
            </li>
            <li className="relative group">
              <Link className="text-gray-700 hover:text-gray-900" to="/shirt">
                Shirt
              </Link>
            </li>
            <li>
              <Link className="text-gray-700 hover:text-gray-900" to="/forml">
                Formal
              </Link>
            </li>
            <li>
              <Link className="text-gray-700 hover:text-gray-900" to="/hudi">
                Hudi
              </Link>
            </li>
          </ul>
        </div>

        <form className="hidden md:flex space-x-2  ml-[500px]">
          <input
            className="border rounded-lg px-3 py-1"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button
            className="px-3 py-1 border rounded-lg text-black border-green-600 hover:bg-blue-600 hover:text-white"
            type="submit"
          >
            Search
          </button>
        </form>

        <Link to="/cart" className="relative mx-4">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-gray-900" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            
          </span>
        </Link>
      </div>
    </nav>
  );
}
