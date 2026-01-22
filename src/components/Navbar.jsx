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
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [hotelInfo, setHotelInfo] = useState({
    name: "Flavoro Foods",
    logo: null,
  });

  /* ===============================
     FIXED LOGO RESOLUTION LOGIC
  ================================ */
  useEffect(() => {
    let name = "Flavoro Foods";
    let logo = null;

    // 1️⃣ Prefer BASE64 (always works on mobile)
    if (user?.hotelLogo?.data && user.hotelLogo.contentType) {
      logo = `data:${user.hotelLogo.contentType};base64,${user.hotelLogo.data}`;
      name = user.hotelname || name;
    }

    // 2️⃣ Use HTTPS URL only
    else if (
      hotelData?.hotelLogo?.url &&
      hotelData.hotelLogo.url.startsWith("https://")
    ) {
      logo = hotelData.hotelLogo.url;
      name = hotelData.hotelname || name;
    }

    // 3️⃣ Name fallback
    else if (hotelData?.hotelname) {
      name = hotelData.hotelname;
    }

    setHotelInfo({ name, logo });
  }, [hotelData, user]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">

        {/* TOP ROW */}
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
              />
            ) : (
              <div
                className="
                  h-8 w-8 md:h-10 md:w-10
                  mr-2 md:mr-3
                  rounded-full
                  bg-green-600 text-white
                  flex items-center justify-center
                  font-bold
                "
              >
                {hotelInfo.name.charAt(0)}
              </div>
            )}

            <span className="text-lg md:text-2xl font-bold text-gray-800 truncate">
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
                className="w-full py-2 px-4 pl-10 rounded-full border"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          {/* AUTH */}
          <div className="hidden md:flex gap-4">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  dispatch(logout());
                  navigate("/");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
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

        {/* MOBILE SEARCH */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="search"
              placeholder="Search foods..."
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-full py-2 px-4 pl-10 rounded-full border"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
