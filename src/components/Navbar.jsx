import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/slices/searchSlice";
import { useNavigate, useParams } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useAuth } from "../components/admin/context/AuthContext";
import { API_URL } from "../../../helper";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotelId } = useParams(); // Get hotelId from URL
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext
  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  // Hotel information state
  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null,
    loading: true
  });

  // Fetch hotel data based on URL parameter or user data
  useEffect(() => {
    const fetchHotelData = async () => {
      let hotelName = "Flavoro Foods";
      let hotelLogo = null;
      
      // Priority 1: Check URL parameter (hotelId)
      if (hotelId) {
        try {
          const response = await fetch(`${API_URL}/hotel/${hotelId}`);
          const data = await response.json();
          
          if (data.success && data.hotelname) {
            hotelName = data.hotelname;
            if (data.hotelLogo) {
              hotelLogo = data.hotelLogo.url || 
                (data.hotelLogo.data ? 
                  `data:${data.hotelLogo.contentType};base64,${data.hotelLogo.data}` : 
                  null);
            }
          }
        } catch (error) {
          console.error("Error fetching hotel data:", error);
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
        logo: hotelLogo,
        loading: false
      });
    };
    
    fetchHotelData();
  }, [hotelId, user]);

  // Function to get logo URL with proper error handling
  const getLogoUrl = () => {
    if (!hotelInfo.logo) return null;
    
    // Ensure logo URL is properly formatted
    if (hotelInfo.logo.startsWith('data:image')) {
      return hotelInfo.logo;
    } else if (hotelInfo.logo.startsWith('http')) {
      return hotelInfo.logo;
    } else if (hotelInfo.logo.includes('base64')) {
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
              <div className="relative">
                <img 
                  src={logoUrl} 
                  alt={hotelInfo.name} 
                  className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-green-600"
                  loading="lazy"
                  onError={(e) => {
                    console.error("Logo failed to load:", hotelInfo.logo);
                    e.target.style.display = 'none';
                    // Show text fallback
                    const fallback = e.target.parentNode.querySelector('.logo-fallback');
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <span 
                  className="logo-fallback text-2xl font-bold text-green-600 mr-3"
                  style={{ display: 'none' }}
                >
                  {hotelInfo.name.charAt(0)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-green-600 mr-3">
                {hotelInfo.name.charAt(0)}
              </span>
            )}
            
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              {!logoUrl && !hotelInfo.name.includes("Flavoro") && (
                <span className="text-sm text-gray-500">
                  Digital Menu
                </span>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-green-600"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
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
                {hotelId && (
                  <div className="text-sm text-gray-500">Hotel ID: {hotelId}</div>
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