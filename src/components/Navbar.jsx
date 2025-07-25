import React, { useState } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/slices/SearchSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cart);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <span className="text-2xl font-bold text-green-600">Flavoro</span>
            <span className="text-2xl font-bold text-gray-800">Foods</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search foods..."
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="w-full py-2 px-4 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button 
              className="text-gray-700 hover:text-green-600 transition-colors"
              onClick={() => navigate("/")}
            >
              Home
            </button>
            <button className="text-gray-700 hover:text-green-600 transition-colors">
              Menu
            </button>
            <div className="relative">
              <button 
                className="text-gray-700 hover:text-green-600 transition-colors flex items-center"
                onClick={() => setActiveCart(!activeCart)}
              >
                <button className="text-gray-700 hover:text-green-600 px-4 py-2 text-left">
                About Us
              </button>
              <button className="text-gray-700 hover:text-green-600 px-4 py-2 text-left">
                Contact
              </button>
                
                
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              className="text-gray-700 mr-4 relative"
              onClick={() => setActiveCart(!activeCart)}
            >
              <FiShoppingCart size={20} />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>
            <button 
              className="text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        <div className="md:hidden mb-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Search foods..."
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full py-2 px-4 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-4 border-t">
            <div className="flex flex-col space-y-4">
              <button 
                className="text-gray-700 hover:text-green-600 px-4 py-2 text-left"
                onClick={() => {
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
              >
                Home
              </button>
              <button className="text-gray-700 hover:text-green-600 px-4 py-2 text-left">
                Menu
              </button>
              <button className="text-gray-700 hover:text-green-600 px-4 py-2 text-left">
                About Us
              </button>
              <button className="text-gray-700 hover:text-green-600 px-4 py-2 text-left">
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;