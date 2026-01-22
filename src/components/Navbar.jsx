import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/slices/searchSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useAuth } from "../components/admin/context/AuthContext";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  // State for hotel info from URL or user
  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null,
    hotelId: null
  });
  const [loadingHotelInfo, setLoadingHotelInfo] = useState(true);

  // API URL - make sure to define this or import from config
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Function to extract hotelId from URL
  const getHotelIdFromURL = () => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('hotelId');
  };

  // Function to fetch hotel data from API
  const fetchHotelData = async (hotelId) => {
    try {
      setLoadingHotelInfo(true);
      const response = await fetch(`${API_URL}/api/hotel/${hotelId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        let logoUrl = null;
        
        // Handle logo from API response
        if (data.hotelLogo) {
          if (data.hotelLogo.url) {
            logoUrl = data.hotelLogo.url;
          } else if (data.hotelLogo.data && data.hotelLogo.contentType) {
            logoUrl = `data:${data.hotelLogo.contentType};base64,${data.hotelLogo.data}`;
          }
        }
        
        setHotelInfo({
          name: data.hotelname || "Flavoro Foods",
          logo: logoUrl,
          hotelId: hotelId
        });
        
        // Store in localStorage for offline use
        localStorage.setItem(`hotel_${hotelId}`, JSON.stringify({
          name: data.hotelname,
          logo: logoUrl,
          timestamp: Date.now()
        }));
      } else {
        // Fallback to default
        setHotelInfo({
          name: "Flavoro Foods",
          logo: null,
          hotelId: null
        });
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      
      // Try to load from localStorage
      const cachedData = localStorage.getItem(`hotel_${hotelId}`);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          // Check if cache is less than 1 day old
          if (Date.now() - parsedData.timestamp < 24 * 60 * 60 * 1000) {
            setHotelInfo({
              name: parsedData.name || "Flavoro Foods",
              logo: parsedData.logo,
              hotelId: hotelId
            });
            return;
          }
        } catch (cacheError) {
          console.error("Error parsing cached hotel data:", cacheError);
        }
      }
      
      // Final fallback
      setHotelInfo({
        name: "Flavoro Foods",
        logo: null,
        hotelId: null
      });
    } finally {
      setLoadingHotelInfo(false);
    }
  };

  // Main effect to determine hotel info
  useEffect(() => {
    const urlHotelId = getHotelIdFromURL();
    
    // Priority 1: If user is logged in (for laptop/admin)
    if (user && user.hotelname) {
      let logoUrl = null;
      
      if (user.hotelLogo) {
        if (user.hotelLogo.url) {
          logoUrl = user.hotelLogo.url;
        } else if (user.hotelLogo.data && user.hotelLogo.contentType) {
          logoUrl = `data:${user.hotelLogo.contentType};base64,${user.hotelLogo.data}`;
        }
      }
      
      setHotelInfo({
        name: user.hotelname,
        logo: logoUrl,
        hotelId: user.hotelId || null
      });
      setLoadingHotelInfo(false);
    }
    // Priority 2: If hotelId is in URL (for mobile/public access)
    else if (urlHotelId) {
      fetchHotelData(urlHotelId);
    }
    // Priority 3: Default
    else {
      setHotelInfo({
        name: "Flavoro Foods",
        logo: null,
        hotelId: null
      });
      setLoadingHotelInfo(false);
    }
  }, [user, location.search]);

  // Handle logo click
  const handleLogoClick = () => {
    // Refresh page to ensure latest data
    if (hotelInfo.hotelId) {
      window.location.href = `/?hotelId=${hotelInfo.hotelId}`;
    } else {
      window.location.href = '/';
    }
  };

  // Generate logo display
  const renderLogo = () => {
    if (loadingHotelInfo) {
      return (
        <div className="h-10 w-10 mr-3 rounded-full border-2 border-green-600 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="text-xs text-gray-500">...</span>
        </div>
      );
    }
    
    if (hotelInfo.logo) {
      return (
        <img 
          src={hotelInfo.logo} 
          alt={hotelInfo.name} 
          className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-green-600"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentNode;
            const fallback = document.createElement('span');
            fallback.className = 'text-2xl font-bold text-green-600 mr-3';
            fallback.textContent = hotelInfo.name.charAt(0);
            parent.insertBefore(fallback, e.target.nextSibling);
          }}
          crossOrigin="anonymous"
          loading="lazy"
        />
      );
    } else {
      return (
        <span className="text-2xl font-bold text-green-600 mr-3">
          {hotelInfo.name.charAt(0)}
        </span>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name Section */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={handleLogoClick}
            title={hotelInfo.hotelId ? `Hotel ID: ${hotelInfo.hotelId}` : "Flavoro Foods"}
          >
            {renderLogo()}
            
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">
                {loadingHotelInfo ? "Loading..." : hotelInfo.name}
              </span>
              {!hotelInfo.logo && !hotelInfo.name.includes("Flavoro") && (
                <span className="text-sm text-gray-500">
                  Digital Menu
                </span>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6 text-gray-600" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-600" />
            )}
          </button>

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

          {/* Cart and User Section - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Icon */}
            <div className="relative">
              <FiShoppingCart 
                className="w-6 h-6 text-gray-600 cursor-pointer hover:text-green-600 transition-colors" 
                onClick={() => navigate("/cart")}
              />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </div>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hi, {user?.name}</span>
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                {hotelInfo.hotelId && (
                  <span className="px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-md">
                    ID: {hotelInfo.hotelId}
                  </span>
                )}
                <button
                  onClick={() => localStorage.getItem("token") ? navigate("/admin") : navigate("/login")}
                  className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Register
                </button>
              </div>
            )}
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
              <div className="px-4 py-2 border-b bg-gray-50">
                <div className="font-medium text-gray-800">{hotelInfo.name}</div>
                {hotelInfo.hotelId && (
                  <div className="text-sm text-gray-500 mt-1">
                    Hotel ID: <span className="font-mono">{hotelInfo.hotelId}</span>
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {user ? "Admin View" : "Public Menu"}
                </div>
              </div>
              
              {/* Cart in Mobile Menu */}
              <div 
                className="flex items-center px-4 py-3 space-x-3 cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  navigate("/cart");
                  setMobileMenuOpen(false);
                }}
              >
                <FiShoppingCart className="w-5 h-5 text-gray-600" />
                <span>Cart</span>
                {totalQty > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalQty}
                  </span>
                )}
              </div>
              
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-t">
                    <span className="text-gray-700">Hi, {user?.name}</span>
                    <button
                      onClick={() => {
                        dispatch(logout());
                        navigate("/");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full mt-3 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 px-4 border-t pt-3">
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
                  
                  {/* Share hotel link */}
                  {hotelInfo.hotelId && (
                    <div className="pt-3">
                      <div className="text-xs text-gray-500 mb-1">Share this menu:</div>
                      <div className="flex items-center bg-gray-100 rounded-md p-2">
                        <input
                          type="text"
                          readOnly
                          value={`${window.location.origin}/?hotelId=${hotelInfo.hotelId}`}
                          className="flex-1 bg-transparent text-xs border-none outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/?hotelId=${hotelInfo.hotelId}`);
                            alert("Link copied to clipboard!");
                          }}
                          className="ml-2 text-xs text-green-600 hover:text-green-700"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
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