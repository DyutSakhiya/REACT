import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../../../helper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState(null);

  /* ---------- Get hotelId from URL ---------- */
  const getHotelIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('hotel_id') || urlParams.get('hotelId');
  };

  /* ---------- Fetch hotel data by hotelId ---------- */
  const fetchHotelData = async (hotelId) => {
    try {
      console.log("Fetching hotel data for ID:", hotelId);
      const response = await fetch(`${API_URL}/hotel/${hotelId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Hotel API response:", data);
      
      if (data.success) {
        // Store in React state ONLY, NOT in localStorage
        setHotelData(data);
        return data;
      } else {
        console.error("Hotel API error:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      return null;
    }
  };

  /* ---------- restore session on mount ---------- */
  useEffect(() => {
    // Clear any existing hotel data from localStorage to prevent quota errors
    try {
      localStorage.removeItem('hotelData');
      localStorage.removeItem('hotelInfo');
    } catch (e) {
      console.log("Could not clear localStorage items:", e);
    }

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Get hotelId from URL
    const hotelId = getHotelIdFromUrl();
    
    if (hotelId) {
      // Fetch hotel data from API (not from localStorage)
      fetchHotelData(hotelId);
    }

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    
    setLoading(false);
  }, []);

  /* ---------- login ---------- */
  const login = async (mobile, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Store only user token and basic user info
        localStorage.setItem("token", data.token);
        
        // Store minimal user data including hotelLogo
        const minimalUser = {
          name: data.user.name,
          mobile: data.user.mobile,
          hotelId: data.user.hotelId,
          hotelname: data.user.hotelname,
          role: data.user.role,
          hotelLogo: data.user.hotelLogo || null
        };
        
        localStorage.setItem("user", JSON.stringify(minimalUser));
        setUser(minimalUser);
        
        // If hotelId is in URL, also fetch fresh hotel data
        const hotelId = getHotelIdFromUrl();
        if (hotelId) {
          fetchHotelData(hotelId);
        }
        
        return true;
      } else {
        alert(data.message || "Login failed");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Network error. Please try again.");
      return false;
    }
  };

  /* ---------- register ---------- */
  const register = async (name, mobile, password, hotelname, imageFile = null) => {
    try {
      let hotelLogo = null;
      if (imageFile) {
        hotelLogo = await new Promise((res) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result.split(",")[1]);
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

  /* ---------- logout ---------- */
  const logout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.log("Error clearing localStorage:", e);
    }
    setUser(null);
    setHotelData(null);
  };

  /* ---------- Clear hotel data ---------- */
  const clearHotelData = () => {
    setHotelData(null);
  };

  /* ---------- Refresh hotel data ---------- */
  const refreshHotelData = async () => {
    const hotelId = getHotelIdFromUrl();
    if (hotelId) {
      return await fetchHotelData(hotelId);
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
        hotelData,
        fetchHotelData,
        clearHotelData,
        refreshHotelData,
        getHotelIdFromUrl
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);