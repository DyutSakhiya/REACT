import React, { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../../../helper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hotelLogo, setHotelLogo] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===============================
     RESTORE SESSION
  ================================ */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.hotelLogo) {
          setHotelLogo(parsedUser.hotelLogo);
        }
      } catch (err) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  /* ===============================
     REGISTER
  ================================ */
  const register = async (name, mobile, password, hotelname, imageFile = null) => {
    try {
      let logoBase64 = null;

      if (imageFile) {
        logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(imageFile);
        });
      }

      const res = await fetch(`${API_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mobile,
          password,
          hotelname,
          hotelLogo: logoBase64,
        }),
      });

      const data = await res.json();
      return data.success;
    } catch (err) {
      alert("Registration failed");
      return false;
    }
  };

  /* ===============================
     LOGIN
  ================================ */
  const login = async (mobile, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setHotelLogo(data.user.hotelLogo || null);
        return true;
      }

      alert(data.message || "Login failed");
      return false;
    } catch (err) {
      alert("Network error");
      return false;
    }
  };

  /* ===============================
     LOGOUT
  ================================ */
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setHotelLogo(null);
  };

  /* ===============================
     SINGLE SOURCE OF LOGO
     (THIS IS THE KEY FIX)
  ================================ */
  const getLogoUrl = () => {
    if (!hotelLogo) return null;

    // base64 string
    if (typeof hotelLogo === "string") {
      return `data:image/png;base64,${hotelLogo}`;
    }

    // object format
    if (hotelLogo.data && hotelLogo.contentType) {
      return `data:${hotelLogo.contentType};base64,${hotelLogo.data}`;
    }

    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        getLogoUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
