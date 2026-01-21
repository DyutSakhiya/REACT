import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
// import { setSearch } from "../redux/slices/SearchSlice";
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

  // Hotel information state
  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null
  });

  // Update hotel info when URL changes
  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let hotelLogo = null;
    
    // Check hotelData from URL parameters first
    if (hotelData) {
      // Get hotel name from API response
      if (hotelData.hotelname) {
        hotelName = hotelData.hotelname;
      } else if (hotelData.name) {
        hotelName = hotelData.name;
      }
      
      // Get hotel logo from API response
      if (hotelData.hotelLogo && hotelData.hotelLogo.url) {
        hotelLogo = hotelData.hotelLogo.url;
      } else if (hotelData.logo) {
        hotelLogo = hotelData.logo;
      } else if (hotelData.hotelLogo) {
        hotelLogo = hotelData.hotelLogo;
      }
    } 
    // Only check user data if no hotelData from URL
    else if (user && user.hotelname) {
      hotelName = user.hotelname;
      if (user.hotelLogo) {
        if (user.hotelLogo.url) {
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
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name - VISIBLE ON BOTH DESKTOP AND MOBILE */}
          <div className="flex items-center">
            {/* Logo Display */}
            {hotelInfo.logo ? (
              <img 
                src={hotelInfo.logo} 
                alt={hotelInfo.name} 
                className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-green-600"
                onError={(e) => {
                  // If logo fails to load, show text fallback
                  e.target.style.display = 'none';
                  const fallbackSpan = e.target.parentNode.querySelector('.logo-fallback');
                  if (fallbackSpan) {
                    fallbackSpan.style.display = 'block';
                  }
                }}
              />
            ) : null}
            
            {/* Text fallback for logo (hidden by default) */}
            <span 
              className="text-2xl font-bold text-green-600 mr-3 logo-fallback"
              style={{ display: hotelInfo.logo ? 'none' : 'block' }}
            >
              {hotelInfo.name.charAt(0)}
            </span>
            
            {/* Hotel Name */}
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              {/* Show table number if available */}
              {hotelData?.table_id && (
                <span className="text-xs md:text-sm text-gray-500">
                  Table: {hotelData.table_id}
                </span>
              )}
              {/* Show "Digital Menu" for custom hotels without logo */}
              {!hotelInfo.logo && !hotelInfo.name.includes("Flavoro") && (
                <span className="text-xs md:text-sm text-gray-500">
                  Digital Menu
                </span>
              )}
            </div>
          </div>

          {/* Desktop Search Bar */}
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

          {/* Desktop Login/Register */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
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
              </div>
            ) : (
              <div className="flex space-x-4">
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
              </div>
            )}
          </div>

          {/* Empty space for mobile alignment */}
          <div className="md:hidden w-10"></div>
        </div>

        {/* Mobile Search Bar - Always visible */}
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
      </div>
    </nav>
  );
};

export default Navbar;