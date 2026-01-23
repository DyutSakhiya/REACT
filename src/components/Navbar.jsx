import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "../redux/slices/searchSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { useAuth } from "../components/admin/context/AuthContext";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, hotelData } = useAuth();

  const cartItems = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null,
  });

  useEffect(() => {
    let hotelName = "Flavoro Foods";
    let hotelLogo = null;

    if (hotelData && hotelData.success) {
      hotelName = hotelData.hotelname || "Flavoro Foods";
      if (hotelData.hotelLogo && hotelData.hotelLogo.url) {
        hotelLogo = hotelData.hotelLogo.url;
      }
    } 
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
    });
  }, [hotelData, user]);

  // ✅ IMPORTANT FIX (Mobile + Database Logo)
  const getLogoUrl = () => {
    if (!hotelInfo.logo) return null;

    if (hotelInfo.logo.startsWith("http")) return hotelInfo.logo;
    if (hotelInfo.logo.startsWith("data:")) return hotelInfo.logo;

    // 🔥 CHANGE THIS IP TO YOUR PC IP ADDRESS
    return `http://192.168.1.5:5000/${hotelInfo.logo}`;
  };

  const logoUrl = getLogoUrl();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="w-full px-4 py-2">
        <div className="flex justify-between items-center">

          {/* ✅ LOGO + HOTEL NAME */}
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={hotelInfo.name}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-contain border-2 border-green-600 bg-white"
                onError={(e) => {
                  e.target.src = "/default-logo.png";
                }}
              />
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-lg">
                {hotelInfo.name.charAt(0)}
              </div>
            )}

            <div className="flex flex-col leading-tight">
              <span className="text-base sm:text-xl font-bold text-gray-800">
                {hotelInfo.name}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                Digital Menu
              </span>
            </div>
          </div>

          {/* ✅ SEARCH BAR (Desktop) */}
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

          {/* ✅ USER SECTION */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
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
              </>
            ) : (
              <>
                <button
                  onClick={() =>
                    localStorage.getItem("token")
                      ? navigate("/admin")
                      : navigate("/login")
                  }
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
              </>
            )}
          </div>
        </div>

        {/* ✅ SEARCH BAR (Mobile) */}
        <div className="md:hidden mt-2">
          <div className="relative">
            <input
              type="search"
              placeholder="Search foods..."
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full py-2 px-4 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
