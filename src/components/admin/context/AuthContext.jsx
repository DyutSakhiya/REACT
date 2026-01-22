import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../../../helper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotelLogo, setHotelLogo] = useState(null);

  /* ---------- restore session on mount ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.hotelLogo) setHotelLogo(parsedUser.hotelLogo);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  /* ---------- register – JSON + base-64 logo ---------- */
  const register = async (name, mobile, password, hotelname, imageFile = null) => {
    try {
      let hotelLogo = null;
      if (imageFile) {
        hotelLogo = await new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result.split(",")[1]); // strip data:url prefix
          reader.readAsDataURL(imageFile);
        });
      }

      const payload = { name, mobile, password, hotelname, hotelLogo };

      const response = await fetch(`${API_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Registration failed");
      }

      const data = await response.json();
      if (data.success) return true;

      alert(data.message || "Registration failed");
      return false;
    } catch (err) {
      console.error("Register error:", err);
      alert(err.message || "Network error. Please try again.");
      return false;
    }
  };

  /* ---------- login ---------- */
  const login = async (mobile, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        if (data.user.hotelLogo) setHotelLogo(data.user.hotelLogo);
        return true;
      }

      alert(data.message || "Login failed");
      return false;
    } catch (err) {
      console.error("Login error:", err);
      alert("Network error. Please try again.");
      return false;
    }
  };

  /* ---------- logout ---------- */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setHotelLogo(null);
  };

  /* ---------- helper: logo URL ---------- */
  const getLogoUrl = () => {
    if (hotelLogo?.data) {
      return `data:${hotelLogo.contentType};base64,${hotelLogo.data}`;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, hotelLogo, getLogoUrl }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);