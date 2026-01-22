import React, { useState, useEffect } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/slices/searchSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useAuth } from "../components/admin/context/AuthContext";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, hotelData } = useAuth();
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
    
    // Priority 1: Use hotelData from API (from URL parameter)
    if (hotelData && hotelData.success) {
      hotelName = hotelData.hotelname || "Flavoro Foods";
      if (hotelData.hotelLogo && hotelData.hotelLogo.url) {
        hotelLogo = hotelData.hotelLogo.url;
      }
      // Handle base64 images from backend
      else if (hotelData.hotelLogo && hotelData.hotelLogo.data && hotelData.hotelLogo.contentType) {
        hotelLogo = `data:${hotelData.hotelLogo.contentType};base64,${hotelData.hotelLogo.data}`;
      }
    }
    // Priority 2: Use user data (if logged in)
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
          {/* Hotel Logo and Name Section */}
          <div className="flex items-center">
            {logoUrl ? (
              <div className="flex items-center">
                <img 
                  src={logoUrl} 
                  alt={hotelInfo.name} 
                  className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-green-600"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    // Show text fallback if logo fails to load
                    const fallback = document.createElement('span');
                    fallback.className = 'text-2xl font-bold text-green-600 mr-3 flex items-center justify-center h-10 w-10 rounded-full border-2 border-green-600';
                    fallback.textContent = hotelInfo.name.charAt(0);
                    e.target.parentNode.insertBefore(fallback, e.target.nextSibling);
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800">
                    {hotelInfo.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    Digital Menu
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                {/* Show first letter as logo if no logo exists */}
                <span className="text-2xl font-bold text-green-600 mr-3 flex items-center justify-center h-10 w-10 rounded-full border-2 border-green-600">
                  {hotelInfo.name.charAt(0)}
                </span>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-800">
                    {hotelInfo.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    Digital Menu
                  </span>
                </div>
              </div>
            )}
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

          {/* Right Side Section - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Icon - Desktop */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-gray-600 hover:text-green-600"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>

            {/* User Section - Desktop (Only show if authenticated) */}
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
              // Desktop: Show login/register only on desktop
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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Cart Icon - Mobile */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-gray-600 hover:text-green-600"
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-green-600"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
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

        {/* Mobile Menu - Only show hotel info, no login/register */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Hotel Info in Mobile - Display hotel logo and name */}
              <div className="px-4 py-2 border-b flex items-center">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={hotelInfo.name} 
                    className="h-12 w-12 mr-3 rounded-full object-cover border-2 border-green-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('span');
                      fallback.className = 'text-xl font-bold text-green-600 mr-3 flex items-center justify-center h-12 w-12 rounded-full border-2 border-green-600';
                      fallback.textContent = hotelInfo.name.charAt(0);
                      e.target.parentNode.insertBefore(fallback, e.target.nextSibling);
                    }}
                  />
                ) : (
                  <span className="text-xl font-bold text-green-600 mr-3 flex items-center justify-center h-12 w-12 rounded-full border-2 border-green-600">
                    {hotelInfo.name.charAt(0)}
                  </span>
                )}
                <div>
                  <div className="font-bold text-lg text-gray-800">{hotelInfo.name}</div>
                  {hotelData?.hotelId && (
                    <div className="text-sm text-gray-500">Hotel ID: {hotelData.hotelId}</div>
                  )}
                </div>
              </div>
              
              {/* Mobile: Only show user info if already logged in */}
              {isAuthenticated && (
                <>
                  <div className="px-4 py-2 border-b">
                    <span className="text-gray-700 font-medium">Welcome, {user?.name}</span>
                    <div className="text-sm text-gray-500 mt-1">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="mx-4 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;