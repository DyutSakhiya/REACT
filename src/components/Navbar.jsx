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

  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null,
    logoType: null // 'url', 'base64', or null
  });

  // DEBUG: Log hotel data whenever it changes
  useEffect(() => {
    console.log("Hotel Data from Auth Context:", hotelData);
    console.log("User Data from Auth Context:", user);
  }, [hotelData, user]);

  // Update hotel info when data changes
  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let hotelLogo = null;
    let logoType = null;
    
    console.log("Processing hotel logo data...");
    
    // Check hotelData first
    if (hotelData) {
      console.log("hotelData structure:", JSON.stringify(hotelData, null, 2));
      
      if (hotelData.success) {
        hotelName = hotelData.hotelname || hotelData.name || "Flavoro Foods";
        
        // Try different possible paths for hotelLogo
        const logoObj = hotelData.hotelLogo || hotelData.logo || hotelData.image;
        
        if (logoObj) {
          console.log("Found logo object:", logoObj);
          
          // Check for URL
          if (logoObj.url) {
            hotelLogo = logoObj.url;
            logoType = 'url';
            console.log("Using URL logo:", hotelLogo);
          }
          // Check for base64 data
          else if (logoObj.data) {
            const contentType = logoObj.contentType || logoObj.type || 'image/jpeg';
            hotelLogo = `data:${contentType};base64,${logoObj.data}`;
            logoType = 'base64';
            console.log("Using base64 logo, content type:", contentType);
          }
          // Check if it's a direct string URL
          else if (typeof logoObj === 'string' && logoObj.startsWith('http')) {
            hotelLogo = logoObj;
            logoType = 'url';
            console.log("Using direct URL string:", hotelLogo);
          }
          // Check if it's a base64 string
          else if (typeof logoObj === 'string' && logoObj.startsWith('data:image')) {
            hotelLogo = logoObj;
            logoType = 'base64';
            console.log("Using direct base64 string");
          }
        }
      }
    }
    
    // If no hotelData logo, check user data
    if (!hotelLogo && user) {
      console.log("Checking user data for logo:", user);
      hotelName = user.hotelname || user.name || hotelName;
      
      const userLogoObj = user.hotelLogo || user.logo;
      if (userLogoObj) {
        if (userLogoObj.url) {
          hotelLogo = userLogoObj.url;
          logoType = 'url';
          console.log("Using user URL logo:", hotelLogo);
        } else if (userLogoObj.data) {
          const contentType = userLogoObj.contentType || 'image/jpeg';
          hotelLogo = `data:${contentType};base64,${userLogoObj.data}`;
          logoType = 'base64';
          console.log("Using user base64 logo");
        }
      }
    }
    
    console.log("Final hotel info:", { 
      name: hotelName, 
      hasLogo: !!hotelLogo,
      logoType: logoType,
      logoPreview: hotelLogo ? hotelLogo.substring(0, 100) + '...' : 'none'
    });
    
    setHotelInfo({
      name: hotelName,
      logo: hotelLogo,
      logoType: logoType
    });
    
  }, [hotelData, user]);

  // Function to test image load
  const testImageLoad = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Handle logo image error
  const handleLogoError = async (e) => {
    console.error("Hotel logo failed to load:", e.target.src);
    e.target.style.display = 'none';
    
    // Remove any existing fallback
    const existingFallback = e.target.parentNode.querySelector('.logo-fallback');
    if (!existingFallback) {
      const fallback = document.createElement('span');
      fallback.className = 'logo-fallback text-2xl font-bold text-green-600';
      fallback.textContent = hotelInfo.name.charAt(0);
      e.target.parentNode.appendChild(fallback);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name Section with Debug Info */}
          <div className="flex items-center group">
            {hotelInfo.logo ? (
              <div className="relative flex items-center mr-3">
                <img 
                  src={hotelInfo.logo} 
                  alt={`${hotelInfo.name} logo`}
                  className="h-12 w-12 rounded-full object-cover border-2 border-green-600"
                  onError={handleLogoError}
                  crossOrigin="anonymous"
                />
                {/* Debug indicator */}
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {hotelInfo.logoType === 'url' ? 'U' : 'B'}
                </div>
              </div>
            ) : (
              <div className="h-12 w-12 flex items-center justify-center rounded-full border-2 border-green-600 bg-green-50 mr-3">
                <FiImage className="text-green-600 text-xl" />
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs md:text-sm text-gray-500">
                  {hotelInfo.logo ? `Logo: ${hotelInfo.logoType}` : 'No logo'}
                </span>
                {process.env.NODE_ENV === 'development' && (
                  <button
                    onClick={() => {
                      console.log("Current hotelInfo:", hotelInfo);
                      console.log("Raw hotelData:", hotelData);
                      console.log("Raw user:", user);
                    }}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Debug
                  </button>
                )}
              </div>
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
                <div className="font-medium text-gray-800">{hotelInfo.name}</div>
                {hotelInfo.logo && (
                  <div className="text-sm text-gray-500">
                    Logo: {hotelInfo.logoType} ({hotelInfo.logo.substring(0, 30)}...)
                  </div>
                )}
                {hotelData?.hotelId && (
                  <div className="text-sm text-gray-500">Hotel ID: {hotelData.hotelId}</div>
                )}
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
      </div>
    </nav>
  );
};

export default Navbar;