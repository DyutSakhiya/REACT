import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useAuth } from "../components/admin/context/AuthContext";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, hotelData } = useAuth();
  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null
  });

  // DEBUG: Log hotelData to see what API returns
  useEffect(() => {
    console.log("DEBUG hotelData:", hotelData);
    console.log("DEBUG hotelData.hotelLogo:", hotelData?.hotelLogo);
  }, [hotelData]);

  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let hotelLogo = null;
    
    // CHECK 1: First check hotelData from URL parameters
    if (hotelData) {
      console.log("Processing hotelData from URL...");
      
      // Get hotel name
      if (hotelData.hotelname) {
        hotelName = hotelData.hotelname;
      } else if (hotelData.name) {
        hotelName = hotelData.name;
      }
      
      // Get hotel logo - CHECK ALL POSSIBLE FORMATS
      if (hotelData.hotelLogo) {
        // Format 1: hotelLogo.url
        if (hotelData.hotelLogo.url) {
          hotelLogo = hotelData.hotelLogo.url;
          console.log("Found logo in hotelLogo.url:", hotelLogo);
        }
        // Format 2: hotelLogo is a direct URL string
        else if (typeof hotelData.hotelLogo === 'string' && hotelData.hotelLogo.startsWith('http')) {
          hotelLogo = hotelData.hotelLogo;
          console.log("Found logo as string URL:", hotelLogo);
        }
        // Format 3: Base64 logo
        else if (hotelData.hotelLogo.data) {
          hotelLogo = `data:${hotelData.hotelLogo.contentType || 'image/jpeg'};base64,${hotelData.hotelLogo.data}`;
          console.log("Found base64 logo");
        }
      }
      // Check alternative logo field
      else if (hotelData.logo) {
        hotelLogo = hotelData.logo;
        console.log("Found logo in 'logo' field:", hotelLogo);
      }
      
      console.log("Final hotelName:", hotelName);
      console.log("Final hotelLogo:", hotelLogo);
    } 
    // CHECK 2: Only check user data if no hotelData
    else if (user && user.hotelname) {
      console.log("Using user data...");
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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        <div className="flex justify-between items-center py-4">
          {/* HOTEL LOGO SECTION - VISIBLE ON MOBILE */}
          <div className="flex items-center">
            {/* Try to show logo if available */}
            {hotelInfo.logo ? (
              <div className="flex items-center">
                <img 
                  src={hotelInfo.logo} 
                  alt={hotelInfo.name}
                  className="h-12 w-12 md:h-10 md:w-10 mr-3 rounded-full object-cover border-2 border-green-600"
                  onError={(e) => {
                    console.error("Logo failed to load:", hotelInfo.logo);
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <span 
                  className="text-2xl font-bold text-green-600 mr-3"
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
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              {/* Show hotel ID if available */}
              {hotelData?.hotelId && (
                <span className="text-xs md:text-sm text-gray-500">
                  Hotel ID: {hotelData.hotelId}
                </span>
              )}
              {/* Show table number if available */}
              {hotelData?.table_id && (
                <span className="text-xs md:text-sm text-gray-500">
                  Table: {hotelData.table_id}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Search */}
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

          {/* Desktop Login */}
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

          {/* Mobile: Empty for spacing */}
          <div className="md:hidden"></div>
        </div>

        {/* Mobile Search - Always visible */}
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
      </div>
    </nav>
  );
};

export default Navbar;