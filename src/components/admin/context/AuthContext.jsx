
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

import { API_URL } from "../../../helper";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotelLogo, setHotelLogo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set hotel logo if available
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

  // Updated register function to handle image upload
  const register = async (name, mobile, password, hotelname, hotelLogo = null) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('mobile', mobile);
      formData.append('password', password);
      formData.append('hotelname', hotelname);
      
      if (hotelLogo) {
        formData.append('hotelLogo', hotelLogo);
      }

      const response = await fetch(`${API_URL}/admin/register`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        alert(data.message || "Registration failed");
        return false;
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Network error. Please try again.");
      return false;
    }
  };

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
        
        // Set hotel logo if available
        if (data.user.hotelLogo) {
          setHotelLogo(data.user.hotelLogo);
        }
        return true;
      } else {
        alert(data.message || "Login failed");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setHotelLogo(null);
  };

  // Function to get logo URL
  const getLogoUrl = () => {
    if (hotelLogo && hotelLogo.data) {
      return `data:${hotelLogo.contentType};base64,${hotelLogo.data}`;
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      hotelLogo,
      getLogoUrl 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
