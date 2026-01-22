import React, { useState, useEffect, useRef } from "react";
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
  
  // Track mobile state
  const [isMobile, setIsMobile] = useState(false);

  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null,
    loaded: false
  });

  const logoRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update hotel info when data changes - MOBILE OPTIMIZED
  useEffect(() => {
    const loadHotelInfo = async () => {
      let hotelName = "Flavoro Foods";
      let hotelLogo = null;
      
      console.log("Loading hotel info, isMobile:", isMobile);
      
      // Priority 1: Use hotelData from API
      if (hotelData && hotelData.success) {
        hotelName = hotelData.hotelname || hotelData.name || "Flavoro Foods";
        
        const logoObj = hotelData.hotelLogo || hotelData.logo || hotelData.image;
        
        if (logoObj) {
          // For mobile, we need to handle images differently
          if (isMobile) {
            console.log("Mobile device detected, optimizing logo loading...");
            
            // For mobile, try to use a smaller version or handle base64 better
            if (logoObj.url) {
              hotelLogo = logoObj.url;
              console.log("Using URL for mobile:", hotelLogo);
            } 
            else if (logoObj.data) {
              // For mobile, ensure base64 is properly formatted
              const contentType = logoObj.contentType || 'image/jpeg';
              
              // Create a smaller version for mobile if data is too large
              const base64Data = logoObj.data;
              if (base64Data.length > 50000) { // If larger than ~50KB
                console.log("Large base64 image detected, using fallback for mobile");
                hotelLogo = null; // Use fallback for mobile
              } else {
                hotelLogo = `data:${contentType};base64,${base64Data}`;
                console.log("Using base64 for mobile");
              }
            }
          } else {
            // Desktop - use original logic
            if (logoObj.url) {
              hotelLogo = logoObj.url;
            } else if (logoObj.data) {
              const contentType = logoObj.contentType || 'image/jpeg';
              hotelLogo = `data:${contentType};base64,${logoObj.data}`;
            }
          }
        }
      }
      // Priority 2: Use user data
      else if (user && user.hotelname) {
        hotelName = user.hotelname || user.name || hotelName;
        
        const userLogoObj = user.hotelLogo || user.logo;
        if (userLogoObj) {
          if (userLogoObj.url) {
            hotelLogo = userLogoObj.url;
          } else if (userLogoObj.data) {
            const contentType = userLogoObj.contentType || 'image/jpeg';
            
            // Mobile optimization
            if (isMobile && userLogoObj.data.length > 50000) {
              console.log("Large user logo, using fallback on mobile");
              hotelLogo = null;
            } else {
              hotelLogo = `data:${contentType};base64,${userLogoObj.data}`;
            }
          }
        }
      }
      
      // Add cache buster for mobile to prevent cached issues
      if (hotelLogo && hotelLogo.startsWith('http') && isMobile) {
        hotelLogo += `?t=${Date.now()}`;
      }
      
      setHotelInfo({
        name: hotelName,
        logo: hotelLogo,
        loaded: true
      });
    };
    
    loadHotelInfo();
  }, [hotelData, user, isMobile]);

  // Force logo reload on mobile
  const reloadLogo = () => {
    if (logoRef.current && isMobile) {
      const src = logoRef.current.src;
      logoRef.current.src = '';
      setTimeout(() => {
        logoRef.current.src = src;
      }, 100);
    }
  };

  // Handle logo error
  const handleLogoError = (e) => {
    console.error("Logo failed to load on", isMobile ? "mobile" : "desktop");
    
    // Try to reload once on mobile
    if (isMobile && !e.target.dataset.retried) {
      console.log("Retrying logo load on mobile...");
      e.target.dataset.retried = true;
      
      const originalSrc = e.target.src;
      e.target.src = '';
      setTimeout(() => {
        e.target.src = originalSrc;
      }, 500);
      return;
    }
    
    // Show fallback
    e.target.style.display = 'none';
    const existingFallback = e.target.parentNode.querySelector('.logo-fallback');
    if (!existingFallback) {
      const fallback = document.createElement('div');
      fallback.className = 'logo-fallback h-12 w-12 flex items-center justify-center rounded-full border-2 border-green-600 bg-green-50';
      const fallbackText = document.createElement('span');
      fallbackText.className = 'text-xl font-bold text-green-600';
      fallbackText.textContent = hotelInfo.name.charAt(0);
      fallback.appendChild(fallbackText);
      e.target.parentNode.appendChild(fallback);
    }
  };

  // Handle logo success
  const handleLogoLoad = (e) => {
    console.log("Logo loaded successfully on", isMobile ? "mobile" : "desktop");
    e.target.style.display = 'block';
    
    // Hide any fallback
    const fallback = e.target.parentNode.querySelector('.logo-fallback');
    if (fallback) {
      fallback.style.display = 'none';
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name Section - MOBILE OPTIMIZED */}
          <div className="flex items-center">
            <div className="relative flex items-center mr-3">
              {hotelInfo.logo ? (
                <>
                  <img 
                    ref={logoRef}
                    src={hotelInfo.logo} 
                    alt={`${hotelInfo.name} logo`}
                    className="h-12 w-12 rounded-full object-cover border-2 border-green-600"
                    onError={handleLogoError}
                    onLoad={handleLogoLoad}
                    loading={isMobile ? "eager" : "lazy"}
                    crossOrigin="anonymous"
                    style={{
                      display: hotelInfo.loaded ? 'block' : 'none'
                    }}
                  />
                  {/* Mobile reload button */}
                  {isMobile && (
                    <button
                      onClick={reloadLogo}
                      className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center opacity-50 hover:opacity-100"
                      title="Reload logo"
                    >
                      ↻
                    </button>
                  )}
                </>
              ) : null}
              
              {/* Fallback logo - always present but hidden when image loads */}
              <div 
                className={`logo-fallback h-12 w-12 flex items-center justify-center rounded-full border-2 border-green-600 bg-green-50 ${
                  hotelInfo.logo && hotelInfo.loaded ? 'hidden' : ''
                }`}
              >
                <span className="text-xl font-bold text-green-600">
                  {hotelInfo.name.charAt(0)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              <div className="text-xs md:text-sm text-gray-500 flex items-center">
                <span>{isMobile ? "📱 Mobile" : "💻 Desktop"}</span>
                {isMobile && hotelInfo.logo && (
                  <button
                    onClick={() => console.log({
                      hotelData,
                      user,
                      hotelInfo,
                      isMobile
                    })}
                    className="ml-2 text-xs text-blue-500"
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
                <div className="text-sm text-gray-500">
                  Device: Mobile | Logo: {hotelInfo.logo ? "Loaded" : "Fallback"}
                </div>
                <button
                  onClick={reloadLogo}
                  className="mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  Reload Logo
                </button>
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