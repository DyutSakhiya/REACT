import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/slices/searchSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useAuth } from "../components/admin/context/AuthContext";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, hotelData } = useAuth();
  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null
  });

  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let hotelLogo = null;
    
    if (hotelData && hotelData.success) {
      hotelName = hotelData.hotelname || "Flavoro Foods";
      
      if (hotelData.hotelLogo) {
        if (typeof hotelData.hotelLogo === 'string') {
          hotelLogo = hotelData.hotelLogo;
        }
        else if (hotelData.hotelLogo.url) {
          hotelLogo = hotelData.hotelLogo.url;
        }
        else if (hotelData.hotelLogo.data && hotelData.hotelLogo.contentType) {
          hotelLogo = `data:${hotelData.hotelLogo.contentType};base64,${hotelData.hotelLogo.data}`;
        }
      }
    }
    else if (user && user.hotelname) {
      hotelName = user.hotelname;
      if (user.hotelLogo) {
        if (typeof user.hotelLogo === 'string') {
          hotelLogo = user.hotelLogo;
        } else if (user.hotelLogo.url) {
          hotelLogo = user.hotelLogo.url;
        } else if (user.hotelLogo.data && user.hotelLogo.contentType) {
          hotelLogo = `data:${user.hotelLogo.contentType};base64,${user.hotelLogo.data}`;
        }
      }
    }
    
    setHotelInfo({
      name: hotelName,
      logo: hotelLogo
    });
    
  }, [hotelData, user]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Single layout for both mobile and desktop */}
        <div className="flex flex-col">
          {/* Top row: Logo, Hotel Name, and Cart */}
          <div className="flex items-center justify-between py-3">
            {/* Left: Logo and Hotel Name */}
            <div className="flex items-center">
              {hotelInfo.logo ? (
                <>
                  <img 
                    src={hotelInfo.logo} 
                    alt={hotelInfo.name}
                    className="h-10 w-10 rounded-full object-cover border-2 border-green-600 mr-3"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-800">
                      {hotelInfo.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      Digital Menu
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full border-2 border-green-600 flex items-center justify-center bg-green-50 mr-3">
                    <span className="text-xl font-bold text-green-600">
                      {hotelInfo.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-800">
                      {hotelInfo.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      Digital Menu
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Right: Cart Icon */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar - Below the header */}
          <div className="pb-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search foods..."
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="w-full py-2 px-4 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* User Section - Only for desktop/authenticated users */}
          <div className="hidden md:flex items-center justify-end space-x-4 pb-3">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Hi, {user?.name}</span>
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => localStorage.getItem("token") ? navigate("/admin") : navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;