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
  
  // AuthContext mathi database na data fetch karva
  const { user, hotelData } = useAuth(); 
  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const totalQty = cartItems.reduce((total, item) => total + item.qty, 0);

  // Default state: Database data mate placeholder
  const [hotelInfo, setHotelInfo] = useState({
    name: "Loading...",
    logo: null
  });

  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let hotelLogo = null;
    
    // PRIORITY 1: Database mathi URL parameter (hotelData)
    if (hotelData && hotelData.success) {
      hotelName = hotelData.hotelname || "Flavoro Foods";
      if (hotelData.hotelLogo && hotelData.hotelLogo.url) {
        hotelLogo = hotelData.hotelLogo.url;
      }
    }
    // PRIORITY 2: Database mathi User Login Profile (user)
    else if (user) {
      hotelName = user.hotelname || "Flavoro Foods";
      if (user.hotelLogo && user.hotelLogo.url) {
        hotelLogo = user.hotelLogo.url;
      } else if (user.hotelLogo && user.hotelLogo.data) {
        // Base64 logo mate fallback logic
        hotelLogo = `data:${user.hotelLogo.contentType};base64,${user.hotelLogo.data}`;
      }
    }
    
    setHotelInfo({
      name: hotelName,
      logo: hotelLogo
    });
    
  }, [hotelData, user]); // Jyare database data change thase tyare update thase

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* LOGO SECTION - Database mathi dynamic display */}
          <div className="flex items-center">
            {hotelInfo.logo ? (
              <img 
                src={hotelInfo.logo} 
                alt={hotelInfo.name} 
                className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-green-600"
                onError={(e) => {
                  e.target.style.display = 'none'; // Logo load na thay to text fallback
                }}
              />
            ) : (
              <div className="h-10 w-10 mr-3 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                {hotelInfo.name.charAt(0)}
              </div>
            )}
            
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search foods..."
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="w-full py-2 px-4 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <button onClick={() => dispatch(logout())} className="text-red-600 font-semibold">Logout</button>
            ) : (
              <button onClick={() => navigate("/login")} className="text-green-600 font-semibold">Login</button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile View - Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full py-2 px-4 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Mobile Sidebar/Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-4">
             <div className="flex flex-col space-y-3 px-4">
                <p className="font-bold text-gray-700">Hotel: {hotelInfo.name}</p>
                {/* Mobile login/logout buttons */}
             </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;