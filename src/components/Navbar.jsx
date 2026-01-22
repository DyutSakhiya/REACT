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

  /* =========================
     SET HOTEL NAME & LOGO
  ========================== */
  useEffect(() => {
    let name = "Flavoro Foods";
    let logo = null;

    if (hotelData?.success) {
      name = hotelData.hotelname || name;
      logo = hotelData?.hotelLogo?.url || null;
    } else if (user?.hotelname) {
      name = user.hotelname;
      if (user.hotelLogo?.url) {
        logo = user.hotelLogo.url;
      }
    }

    setHotelInfo({ name, logo });
  }, [hotelData, user]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* =========================
            TOP ROW
        ========================== */}
        <div className="flex items-center justify-between py-3">
          
          {/* LOGO + NAME */}
          <div className="flex items-center min-w-0">
            {hotelInfo.logo ? (
              <img
                src={hotelInfo.logo}
                alt={hotelInfo.name}
                className="
                  h-8 w-8 md:h-10 md:w-10
                  mr-2 md:mr-3
                  rounded-full
                  object-cover
                  border-2 border-green-600
                  flex-shrink-0
                "
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <div
                className="
                  h-8 w-8 md:h-10 md:w-10
                  mr-2 md:mr-3
                  rounded-full
                  bg-green-600
                  text-white
                  flex items-center justify-center
                  font-bold
                  flex-shrink-0
                "
              >
                {hotelInfo.name.charAt(0)}
              </div>
            )}

            <span
              className="
                text-lg md:text-2xl
                font-bold
                text-gray-800
                truncate
              "
            >
              {hotelInfo.name}
            </span>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search foods..."
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="
                  w-full py-2 px-4 pl-10
                  rounded-full
                  border border-gray-300
                  focus:outline-none
                  focus:ring-2 focus:ring-green-500
                "
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Hi, {user?.name}</span>
                <button
                  onClick={() => {
                    dispatch(logout());
                    navigate("/");
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 border border-green-600 text-green-600 rounded-md"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* =========================
            MOBILE SEARCH
        ========================== */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Search foods..."
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="
                w-full py-2 px-4 pl-10
                rounded-full
                border border-gray-300
                focus:outline-none
                focus:ring-2 focus:ring-green-500
              "
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
