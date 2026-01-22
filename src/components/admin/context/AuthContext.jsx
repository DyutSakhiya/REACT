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
        if (parsedUser.hotelLogo) {
          setHotelLogo(parsedUser.hotelLogo);
        }
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
      let hotelLogoData = null;
      if (imageFile) {
        hotelLogoData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = reader.result.split(",")[1];
            resolve({
              data: base64String,
              contentType: imageFile.type
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const payload = { 
        name, 
        mobile, 
        password, 
        hotelname, 
        hotelLogo: hotelLogoData 
      };

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
        if (data.user.hotelLogo) {
          setHotelLogo(data.user.hotelLogo);
        }
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

  /* ---------- update user ---------- */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  /* ---------- update hotel logo ---------- */
  const updateHotelLogo = (newLogo) => {
    setHotelLogo(newLogo);
    if (user) {
      const updatedUser = { ...user, hotelLogo: newLogo };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  /* ---------- helper: logo URL ---------- */
  const getLogoUrl = () => {
    if (hotelLogo) {
      if (hotelLogo.url) {
        return hotelLogo.url;
      } else if (hotelLogo.data && hotelLogo.contentType) {
        return `data:${hotelLogo.contentType};base64,${hotelLogo.data}`;
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        login, 
        register, 
        logout, 
        loading, 
        hotelLogo, 
        getLogoUrl,
        updateUser,
        updateHotelLogo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);