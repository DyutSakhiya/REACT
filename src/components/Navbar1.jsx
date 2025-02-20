import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-100 shadow-md ">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center  ">
        <img
          src={"./public/logo.png"}
          alt=""
          className="w-16 h-12 mx-4 object-cover"
        />
        <button
          className="text-gray-600  md:hidden absolute top-2  right-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center w-full md:w-auto `}
        >
          <ul className="md:flex space-y-2 md:space-y-0 md:space-x-4">
           
            <li>
              <Link className="text-gray-700 hover:text-gray-900" to="/t-shirt">
                t-shirt
              </Link>
            </li>
            <li className="relative group">
              <Link className="text-gray-700 hover:text-gray-900" to="/shirt">
                shirt
              </Link>
            </li>
            <li>
              <Link className="text-gray-700 hover:text-gray-900" to="/forml">
                forml
              </Link>
            </li>
            <li>
              <Link className="text-gray-700 hover:text-gray-900" to="/hudi">
                hudi
              </Link>
            </li>
            <li>
              <Link className="text-gray-700 hover:text-gray-900" to="/home">
                ToduList
              </Link>
            </li>
            
          </ul>
        </div>
        <form className="hidden md:flex space-x-2">
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
      </div>
    </nav>
  );
}
