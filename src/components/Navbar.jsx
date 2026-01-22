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
    loading: true
  });

  // Fetch hotel data based on URL parameter
  useEffect(() => {
    const fetchHotelData = async () => {
      let hotelName = "Flavoro Foods";
      let hotelLogo = null;
      
      // ONLY fetch if hotelId is in URL (for mobile access)
      if (hotelId) {
        try {
          const response = await fetch(`/api/hotel/${hotelId}`);
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.hotelname) {
              hotelName = data.hotelname;
              if (data.hotelLogo && data.hotelLogo.url) {
                hotelLogo = data.hotelLogo.url;
              }
            }
          }
        } catch (error) {
          console.error("Error fetching hotel data:", error);
        }
      }
      
      setHotelInfo({
        name: hotelName,
        logo: hotelLogo,
        loading: false,
        hotelId: hotelId
      });
    };
    
    fetchHotelData();
  }, [hotelId]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle logo error
  const handleLogoError = (e) => {
    console.log("Logo failed to load");
    e.target.style.display = 'none';
    const fallback = e.target.nextElementSibling;
    if (fallback) {
      fallback.style.display = 'block';
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-1">
        {/* MOBILE VIEW (below 768px) */}
        <div className="md:hidden">
          <div className="flex justify-between items-center py-3">
            {/* Hotel Info - Only show when hotelId is present in URL */}
            {hotelId ? (
              <div className="flex items-center">
                {hotelInfo.logo ? (
                  <div className="relative">
                    <img 
                      src={hotelInfo.logo} 
                      alt={hotelInfo.name} 
                      className="h-10 w-10 mr-2 rounded-full object-cover border border-green-500"
                      onError={handleLogoError}
                    />
                    <span 
                      className="text-xl font-bold text-green-600 mr-2"
                      style={{ display: 'none' }}
                    >
                      {hotelInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <span className="text-lg font-bold text-green-600">
                      {hotelInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col">
                  <span className="font-bold text-gray-800">
                    {hotelInfo.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {hotelId ? `ID: ${hotelId}` : "Digital Menu"}
                  </span>
                </div>
              </div>
            ) : (
              /* Default app name when no hotelId */
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-600 mr-2">F</span>
                <span className="text-xl font-bold text-gray-800">Flavoro Foods</span>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Search Bar - Always visible */}
          <div className="mb-3">
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

          {/* Mobile Menu Panel */}
          <div className={`transition-all duration-300 ${mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="bg-white py-4 border-t">
              <div className="flex flex-col space-y-4">
                {/* Hotel Info in Mobile Menu */}
                {hotelId && (
                  <div className="px-4 py-2 border-b">
                    <div className="flex items-center space-x-3">
                      {hotelInfo.logo ? (
                        <img 
                          src={hotelInfo.logo} 
                          alt={hotelInfo.name}
                          className="h-8 w-8 rounded-full object-cover border border-green-400"
                          onError={handleLogoError}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">
                            {hotelInfo.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-gray-800">{hotelInfo.name}</div>
                        <div className="text-xs text-gray-500">ID: {hotelId}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* User Actions */}
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2">
                      <span className="text-gray-700">Hi, {user?.name}</span>
                    </div>
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
          </div>
        </div>

        {/* DESKTOP VIEW (768px and above) */}
        <div className="hidden md:block">
          <div className="flex justify-between items-center py-4">
            {/* Hotel Logo and Name Section */}
            <div className="flex items-center">
              {hotelInfo.logo ? (
                <div className="relative">
                  <img 
                    src={hotelInfo.logo} 
                    alt={hotelInfo.name} 
                    className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-green-600"
                    onError={handleLogoError}
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

            {/* Search Bar - Desktop */}
            <div className="flex-1 max-w-md mx-6">
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
            <div className="flex items-center space-x-6">
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;