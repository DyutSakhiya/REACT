import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/slices/searchSlice";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useAuth } from "../components/admin/context/AuthContext";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotelId } = useParams(); // Get hotelId from URL
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  // Hotel information state
  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null,
    loading: true,
    hotelId: null
  });

  // Fetch hotel data based on URL parameter
  useEffect(() => {
    const fetchHotelData = async () => {
      let hotelName = "Flavoro Foods";
      let hotelLogo = null;
      let currentHotelId = hotelId;
      
      // Priority 1: If hotelId in URL, fetch from backend
      if (currentHotelId) {
        try {
          console.log("Fetching hotel data for ID:", currentHotelId);
          const response = await fetch(`/api/hotel/${currentHotelId}`);
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.hotelname) {
              hotelName = data.hotelname;
              if (data.hotelLogo && data.hotelLogo.url) {
                hotelLogo = data.hotelLogo.url;
                console.log("Hotel logo loaded:", data.hotelLogo.url.substring(0, 50) + "...");
              }
            }
          } else {
            console.error("API response not OK:", response.status);
          }
        } catch (error) {
          console.error("Error fetching hotel data:", error);
        }
      }
      // Priority 2: Use logged in user data
      else if (user && user.hotelname) {
        hotelName = user.hotelname;
        currentHotelId = user.hotelId;
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
        logo: hotelLogo,
        loading: false,
        hotelId: currentHotelId
      });
    };
    
    fetchHotelData();
  }, [hotelId, user]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle logo error - show fallback
  const handleLogoError = (e) => {
    console.log("Logo failed to load");
    e.target.style.display = 'none';
    const parent = e.target.parentElement;
    if (parent) {
      const fallback = parent.querySelector('.logo-fallback');
      if (fallback) {
        fallback.style.display = 'flex';
      }
    }
  };

  // Get logo URL or fallback
  const getLogoDisplay = () => {
    if (hotelInfo.logo) {
      return (
        <div className="relative">
          <img 
            src={hotelInfo.logo} 
            alt={hotelInfo.name} 
            className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-green-600"
            onError={handleLogoError}
          />
          <div className="logo-fallback h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-600" style={{ display: 'none' }}>
            <span className="text-lg md:text-xl font-bold text-green-600">
              {hotelInfo.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-green-100 flex items-center justify-center border-2 border-green-600">
          <span className="text-lg md:text-xl font-bold text-green-600">
            {hotelInfo.name.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name Section - BOTH MOBILE & DESKTOP */}
          <div className="flex items-center">
            {/* Logo */}
            {getLogoDisplay()}
            
            {/* Hotel Name and Info */}
            <div className="ml-3 flex flex-col">
              <span className="text-lg md:text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              {hotelInfo.hotelId && (
                <span className="text-xs md:text-sm text-gray-500">
                  Hotel ID: {hotelInfo.hotelId}
                </span>
              )}
              {!hotelInfo.hotelId && (
                <span className="text-xs md:text-sm text-gray-500">
                  Digital Menu
                </span>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle Button - MOBILE ONLY */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-700 hover:text-green-600"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>

          {/* Search Bar - DESKTOP ONLY */}
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

          {/* User Section - DESKTOP ONLY */}
          <div className="hidden md:flex items-center space-x-6">
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

        {/* Search Bar - MOBILE ONLY */}
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

        {/* Mobile Menu Panel - MOBILE ONLY */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Hotel Info in Mobile Menu */}
              <div className="px-4 py-2 border-b">
                <div className="flex items-center space-x-3">
                  {hotelInfo.logo ? (
                    <div className="relative">
                      <img 
                        src={hotelInfo.logo} 
                        alt={hotelInfo.name}
                        className="h-10 w-10 rounded-full object-cover border border-green-500"
                        onError={handleLogoError}
                      />
                      <div className="logo-fallback h-10 w-10 rounded-full bg-green-100 flex items-center justify-center border border-green-500" style={{ display: 'none' }}>
                        <span className="text-sm font-bold text-green-600">
                          {hotelInfo.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center border border-green-500">
                      <span className="text-sm font-bold text-green-600">
                        {hotelInfo.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-gray-800">{hotelInfo.name}</div>
                    {hotelInfo.hotelId && (
                      <div className="text-xs text-gray-500">Hotel ID: {hotelInfo.hotelId}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* User Actions */}
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2">
                    <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      dispatch(logout());
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="mx-4 px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
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
                    className="w-full px-4 py-3 text-sm font-medium text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;