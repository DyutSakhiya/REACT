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

  /* ---------- register – with image handling ---------- */
  const register = async (name, mobile, password, hotelname, imageFile = null) => {
    try {
      let hotelLogoData = null;

      // Convert image to base64 if provided
      if (imageFile) {
        hotelLogoData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            // Get only the base64 part (without data:url prefix)
            const dataUrl = reader.result;
            const base64Data = dataUrl.split(',')[1]; // Extract only base64 string
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      // Prepare registration payload
      const payload = { 
        name, 
        mobile, 
        password, 
        hotelname, 
        hotelLogo: hotelLogoData // Send only base64 string, not full data URL
      };

      console.log("Sending registration with logo:", hotelLogoData ? "Yes" : "No");

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
      if (data.success) {
        alert("Registration successful! Please login.");
        return true;
      }

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

  /* ---------- helper: get logo URL ---------- */
  const getLogoUrl = () => {
    if (!hotelLogo) return null;
    
    // Check if hotelLogo is already a complete data URL
    if (typeof hotelLogo === 'string' && hotelLogo.startsWith('data:')) {
      return hotelLogo;
    }
    
    // Check if hotelLogo is a regular URL (http/https)
    if (typeof hotelLogo === 'string' && (hotelLogo.startsWith('http://') || hotelLogo.startsWith('https://'))) {
      return hotelLogo;
    }
    
    // If it's a base64 string, construct data URL
    if (typeof hotelLogo === 'string') {
      return `data:image/jpeg;base64,${hotelLogo}`;
    }
    
    // If it's an object with data property (base64)
    if (hotelLogo && typeof hotelLogo === 'object' && hotelLogo.data) {
      return `data:${hotelLogo.contentType || 'image/jpeg'};base64,${hotelLogo.data}`;
    }
    
    return null;
  };

  /* ---------- update user ---------- */
  const updateUser = (userData) => {
    setUser(userData);
    if (userData.hotelLogo) setHotelLogo(userData.hotelLogo);
    localStorage.setItem("user", JSON.stringify(userData));
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
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);