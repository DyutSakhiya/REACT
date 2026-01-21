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
  const { user, hotelData } = useAuth(); // Get user from AuthContext
  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  // Get hotel information based on URL or user data
  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null
  });

  // Update hotel info when data changes
  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let hotelLogo = null;
    
    // ALWAYS use hotelData from URL parameters when available
    // This is what customers see on mobile
    if (hotelData) {
      // Get hotel name
      if (hotelData.hotelname) {
        hotelName = hotelData.hotelname;
      } else if (hotelData.name) {
        hotelName = hotelData.name;
      }
      
      // Get hotel logo
      if (hotelData.hotelLogo && hotelData.hotelLogo.url) {
        hotelLogo = hotelData.hotelLogo.url;
      } else if (hotelData.logo) {
        hotelLogo = hotelData.logo;
      } else if (hotelData.hotelLogo) {
        // Handle different logo formats
        hotelLogo = hotelData.hotelLogo;
      }
    } 
    // Only use user data if NO hotelData AND user is logged in (hotel owner)
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

  // Function to get logo URL
  const getLogoUrl = () => {
    if (hotelInfo.logo) {
      return hotelInfo.logo;
    }
    return null;
  };

  const logoUrl = getLogoUrl();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name - ALWAYS VISIBLE */}
          <div className="flex items-center">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={hotelInfo.name} 
                className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-green-600"
                onError={(e) => {
                  e.target.style.display = 'none';
                  // Show text fallback if logo fails to load
                  const fallback = document.createElement('span');
                  fallback.className = 'text-2xl font-bold text-green-600 mr-3';
                  fallback.textContent = hotelInfo.name.charAt(0);
                  e.target.parentNode.insertBefore(fallback, e.target.nextSibling);
                }}
              />
            ) : (
              <span className="text-2xl font-bold text-green-600 mr-3">
                {hotelInfo.name.charAt(0)}
              </span>
            )}
            
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              {/* Show hotel ID if available from URL */}
              {hotelData?.hotelId && (
                <span className="text-xs md:text-sm text-gray-500">
                  Table: {hotelData.table_id || "1"}
                </span>
              )}
              {!logoUrl && !hotelInfo.name.includes("Flavoro") && (
                <span className="text-xs md:text-sm text-gray-500">
                  Digital Menu
                </span>
              )}
            </div>
          </div>

          {/* Search Bar - Desktop */}
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

          {/* Desktop ONLY - Login/Register for hotel owners */}
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

          {/* Mobile - EMPTY (no buttons, no login, no register) */}
          <div className="md:hidden">
            {/* Intentionally empty - customers don't need login on mobile */}
          </div>
        </div>

        {/* Mobile Search - Always visible on mobile */}
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

        {/* NO MOBILE MENU - Removed completely */}
      </div>
    </nav>
  );
};

export default Navbar;