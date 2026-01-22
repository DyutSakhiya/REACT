import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiImage } from "react-icons/fi";
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

  // Simplified hotel info state
  const [hotelLogo, setHotelLogo] = useState(null);
  const [hotelName, setHotelName] = useState("Flavoro Foods");

  // Debug logging
  useEffect(() => {
    console.log("=== NAVBAR DEBUG INFO ===");
    console.log("1. hotelData from AuthContext:", hotelData);
    console.log("2. user from AuthContext:", user);
    console.log("3. localStorage token:", localStorage.getItem("token"));
    console.log("=========================");
  }, [hotelData, user]);

  // Extract hotel info
  useEffect(() => {
    let name = "Flavoro Foods";
    let logo = null;

    // Check hotelData first (from URL parameter)
    if (hotelData) {
      console.log("Processing hotelData:", hotelData);
      
      // Get hotel name
      name = hotelData.hotelname || hotelData.name || hotelData.hotelName || "Flavoro Foods";
      
      // Try to get logo from various possible paths
      let logoSource = null;
      
      if (hotelData.hotelLogo) {
        logoSource = hotelData.hotelLogo;
      } else if (hotelData.logo) {
        logoSource = hotelData.logo;
      } else if (hotelData.image) {
        logoSource = hotelData.image;
      }
      
      console.log("Found logo source:", logoSource);
      
      if (logoSource) {
        // If it's a string URL
        if (typeof logoSource === 'string') {
          if (logoSource.startsWith('http') || logoSource.startsWith('data:image')) {
            logo = logoSource;
            console.log("Using string logo:", logo.substring(0, 50));
          }
        }
        // If it's an object with url
        else if (logoSource.url && typeof logoSource.url === 'string') {
          logo = logoSource.url;
          console.log("Using object.url logo:", logo);
        }
        // If it's an object with base64 data
        else if (logoSource.data && typeof logoSource.data === 'string') {
          const contentType = logoSource.contentType || logoSource.type || 'image/jpeg';
          logo = `data:${contentType};base64,${logoSource.data}`;
          console.log("Using base64 logo");
        }
      }
    }
    
    // If still no logo from hotelData, check user data
    if (!logo && user) {
      console.log("Checking user data for logo:", user);
      name = user.hotelname || user.name || name;
      
      let userLogoSource = user.hotelLogo || user.logo;
      if (userLogoSource) {
        if (typeof userLogoSource === 'string') {
          logo = userLogoSource;
        } else if (userLogoSource.url) {
          logo = userLogoSource.url;
        } else if (userLogoSource.data) {
          const contentType = userLogoSource.contentType || 'image/jpeg';
          logo = `data:${contentType};base64,${userLogoSource.data}`;
        }
      }
    }

    console.log("Setting hotel info - Name:", name, "Has Logo:", !!logo);
    
    setHotelName(name);
    setHotelLogo(logo);
  }, [hotelData, user]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name - SIMPLIFIED */}
          <div className="flex items-center">
            {hotelLogo ? (
              <div className="relative mr-3">
                <img 
                  src={hotelLogo} 
                  alt={hotelName}
                  className="h-12 w-12 rounded-full object-cover border-2 border-green-600"
                  onError={(e) => {
                    console.error("❌ Logo failed to load:", hotelLogo);
                    e.target.style.display = 'none';
                    // Show fallback
                    const parent = e.target.parentNode;
                    if (!parent.querySelector('.logo-fallback')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'logo-fallback h-12 w-12 flex items-center justify-center rounded-full border-2 border-green-600 bg-green-50';
                      const text = document.createElement('span');
                      text.className = 'text-2xl font-bold text-green-600';
                      text.textContent = hotelName.charAt(0);
                      fallback.appendChild(text);
                      parent.appendChild(fallback);
                    }
                  }}
                  onLoad={() => console.log("✅ Logo loaded successfully:", hotelLogo)}
                />
              </div>
            ) : (
              <div className="h-12 w-12 flex items-center justify-center rounded-full border-2 border-green-600 bg-green-50 mr-3">
                <span className="text-2xl font-bold text-green-600">
                  {hotelName.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                {hotelName}
              </span>
              {!hotelLogo && (
                <span className="text-xs text-gray-500">
                  (No logo configured)
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

          {/* User Section - Desktop */}
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
            
            {/* Cart Icon - Desktop */}
            <div 
              className="relative cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-green-600" />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Menu Button and Cart */}
          <div className="flex md:hidden items-center space-x-4">
            {/* Cart Icon - Mobile */}
            <div 
              className="relative cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <FiShoppingCart className="text-2xl text-gray-700 hover:text-green-600" />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-2xl text-gray-700 focus:outline-none"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Hotel Info in Mobile */}
              <div className="px-4 py-2 border-b">
                <div className="font-medium text-gray-800">{hotelName}</div>
                <div className="text-sm text-gray-500">
                  Logo: {hotelLogo ? "Present" : "Not set"}
                </div>
              </div>
              
              {isAuthenticated ? (
                <>
                  <span className="px-4 py-2 text-gray-700">Hi, {user?.name}</span>
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
              ) : (
                <div className="space-y-3 px-4">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debug Panel (Development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div className="font-bold mb-1">Debug Info:</div>
            <div>Hotel Name: {hotelName}</div>
            <div>Has Logo: {hotelLogo ? "Yes" : "No"}</div>
            <div>Logo Preview: {hotelLogo ? hotelLogo.substring(0, 80) + "..." : "N/A"}</div>
            <button 
              onClick={() => {
                console.log("=== MANUAL DEBUG ===");
                console.log("hotelData:", hotelData);
                console.log("user:", user);
                console.log("hotelLogo:", hotelLogo);
              }}
              className="mt-1 text-blue-500"
            >
              Click to log details
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;