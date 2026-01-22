import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
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
    logoLoaded: false
  });

  // Update hotel info when data changes
  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let hotelLogo = null;
    
    console.log("Processing hotel data for logo...");
    
    // Check hotelData from URL parameter
    if (hotelData && hotelData.success) {
      hotelName = hotelData.hotelname || hotelData.name || "Flavoro Foods";
      
      // Try to get logo from different possible structures
      const getLogoFromObject = (logoObj) => {
        if (!logoObj) return null;
        
        // If it's already a string URL
        if (typeof logoObj === 'string') {
          // Check if it's a base64 string
          if (logoObj.startsWith('data:image')) {
            return logoObj;
          }
          // Check if it's a URL
          if (logoObj.startsWith('http') || logoObj.startsWith('/')) {
            return logoObj;
          }
        }
        
        // If it's an object with url property
        if (logoObj.url) {
          return logoObj.url;
        }
        
        // If it's an object with data property (base64)
        if (logoObj.data) {
          const contentType = logoObj.contentType || 'image/jpeg';
          return `data:${contentType};base64,${logoObj.data}`;
        }
        
        return null;
      };
      
      // Try different property names
      hotelLogo = getLogoFromObject(hotelData.hotelLogo) || 
                  getLogoFromObject(hotelData.logo) || 
                  getLogoFromObject(hotelData.image);
      
      console.log("Hotel Data Logo found:", hotelLogo ? "Yes" : "No");
    }
    
    // If no hotelData logo, check user data
    if (!hotelLogo && user && user.hotelname) {
      hotelName = user.hotelname || user.name || hotelName;
      
      const userLogoObj = user.hotelLogo || user.logo;
      if (userLogoObj) {
        if (userLogoObj.url) {
          hotelLogo = userLogoObj.url;
        } else if (userLogoObj.data && userLogoObj.contentType) {
          hotelLogo = `data:${userLogoObj.contentType};base64,${userLogoObj.data}`;
        }
      }
    }
    
    console.log("Setting hotel info:", { 
      name: hotelName, 
      hasLogo: !!hotelLogo,
      logo: hotelLogo ? hotelLogo.substring(0, 50) + "..." : "none"
    });
    
    setHotelInfo({
      name: hotelName,
      logo: hotelLogo,
      logoLoaded: false
    });
    
  }, [hotelData, user]);

  // Handle logo load success
  const handleLogoLoad = () => {
    console.log("Hotel logo loaded successfully");
    setHotelInfo(prev => ({ ...prev, logoLoaded: true }));
  };

  // Handle logo load error
  const handleLogoError = (e) => {
    console.error("Hotel logo failed to load:", e.target.src);
    setHotelInfo(prev => ({ ...prev, logoLoaded: false }));
    e.target.style.display = 'none';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name Section */}
          <div 
            className="flex items-center"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            {hotelInfo.logo ? (
              <div className="flex items-center mr-3">
                <img 
                  src={hotelInfo.logo} 
                  alt={`${hotelInfo.name} logo`}
                  className="h-12 w-12 rounded-full object-cover border-2 border-green-600"
                  onLoad={handleLogoLoad}
                  onError={handleLogoError}
                  crossOrigin="anonymous"
                  loading="eager"
                />
                {/* Loading indicator */}
                {!hotelInfo.logoLoaded && (
                  <div className="absolute ml-3">
                    <div className="h-12 w-12 rounded-full border-2 border-green-600 border-t-transparent animate-spin"></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-12 w-12 flex items-center justify-center rounded-full border-2 border-green-600 bg-green-50 mr-3">
                <span className="text-2xl font-bold text-green-600">
                  {hotelInfo.name.charAt(0)}
                </span>
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              {!hotelInfo.logo && (
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

        {/* Mobile Search - ALWAYS SHOW THIS */}
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
              {/* Hotel Info in Mobile - WITH LOGO */}
              <div className="px-4 py-2 border-b flex items-center">
                {hotelInfo.logo ? (
                  <img 
                    src={hotelInfo.logo} 
                    alt={`${hotelInfo.name} logo`}
                    className="h-10 w-10 rounded-full object-cover border-2 border-green-600 mr-3"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'h-10 w-10 rounded-full border-2 border-green-600 bg-green-50 flex items-center justify-center mr-3';
                      fallback.innerHTML = `<span class="text-lg font-bold text-green-600">${hotelInfo.name.charAt(0)}</span>`;
                      e.target.parentNode.insertBefore(fallback, e.target.nextSibling);
                    }}
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full border-2 border-green-600 bg-green-50 flex items-center justify-center mr-3">
                    <span className="text-lg font-bold text-green-600">
                      {hotelInfo.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-800">{hotelInfo.name}</div>
                  <div className="text-sm text-gray-500">Tap to refresh</div>
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
      </div>
    </nav>
  );
};

export default Navbar;