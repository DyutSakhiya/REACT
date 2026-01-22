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
  const { user, hotelLogo } = useAuth(); // Use hotelLogo from context
  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  // Get hotel information
  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null
  });

  // Update hotel info when user data changes
  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let logoUrl = null;
    
    // If user is logged in, use their hotel info
    if (user) {
      hotelName = user.hotelname || "Flavoro Foods";
      
      // Get logo from context's getLogoUrl() function
      const { getLogoUrl } = useAuth();
      logoUrl = getLogoUrl ? getLogoUrl() : null;
      
      // If not available from context, try user data
      if (!logoUrl && user.hotelLogo) {
        if (user.hotelLogo.url) {
          logoUrl = user.hotelLogo.url;
        } else if (user.hotelLogo.data && user.hotelLogo.contentType) {
          logoUrl = `data:${user.hotelLogo.contentType};base64,${user.hotelLogo.data}`;
        }
      }
    }
    
    setHotelInfo({
      name: hotelName,
      logo: logoUrl
    });
    
  }, [user, hotelLogo]);

  // Function to handle logo click
  const handleLogoClick = () => {
    // Add any logo click functionality here if needed
    console.log("Logo clicked");
  };

  // Get current URL parameters to check for hotel ID
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('hotelId');
    
    if (hotelId && !user) {
      // If there's a hotelId in URL and user is not logged in,
      // you might want to fetch hotel data from API
      fetchHotelData(hotelId);
    }
  }, [user]);

  const fetchHotelData = async (hotelId) => {
    try {
      const response = await fetch(`${API_URL}/hotel/${hotelId}`);
      const data = await response.json();
      
      if (data.success) {
        setHotelInfo({
          name: data.hotelname || "Flavoro Foods",
          logo: data.hotelLogo?.url || null
        });
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* Hotel Logo and Name Section */}
          <div 
            className="flex items-center"
            onClick={handleLogoClick}
          >
            {hotelInfo.logo ? (
              <img 
                src={hotelInfo.logo} 
                alt={hotelInfo.name} 
                className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-green-600"
                onError={(e) => {
                  e.target.style.display = 'none';
                  // Show text fallback
                  const fallback = document.createElement('span');
                  fallback.className = 'text-2xl font-bold text-green-600 mr-3';
                  fallback.textContent = hotelInfo.name.charAt(0);
                  e.target.parentNode.insertBefore(fallback, e.target.nextSibling);
                }}
                // Add crossOrigin attribute for better mobile compatibility
                crossOrigin="anonymous"
              />
            ) : (
              <span className="text-2xl font-bold text-green-600 mr-3">
                {hotelInfo.name.charAt(0)}
              </span>
            )}
            
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">
                {hotelInfo.name}
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

          {/* Cart Icon - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative">
              <FiShoppingCart 
                className="w-6 h-6 text-gray-600 cursor-pointer" 
                onClick={() => navigate("/cart")}
              />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </div>

            {/* User Section - Desktop */}
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
                {user?.hotelId && (
                  <div className="text-sm text-gray-500">Hotel ID: {user.hotelId}</div>
                )}
              </div>
              
              {/* Cart in Mobile Menu */}
              <div 
                className="flex items-center px-4 py-2 space-x-3 cursor-pointer hover:bg-gray-50"
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