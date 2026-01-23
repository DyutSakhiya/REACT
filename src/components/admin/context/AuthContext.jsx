import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "../../../helper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState(null);

  /* ---------- Fetch hotel data by hotelId ---------- */
  const fetchHotelData = async (hotelId) => {
    try {
      console.log("Fetching hotel data for:", hotelId);
      const response = await fetch(`${API_URL}/hotel/${hotelId}`);
      const data = await response.json();
      
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
    // Clear any existing hotel data from localStorage
    localStorage.removeItem('hotelData');
    localStorage.removeItem('hotelInfo');

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Get hotelId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hotelId = urlParams.get('hotel_id') || urlParams.get('hotelId');
    
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

      const data = await response.json();
      if (data.success) {
        // Store only user token and basic user info
        localStorage.setItem("token", data.token);
        
        // Store minimal user data without hotelLogo
        const minimalUser = {
          name: data.user.name,
          mobile: data.user.mobile,
          hotelId: data.user.hotelId,
          hotelname: data.user.hotelname,
          role: data.user.role
        };
        localStorage.setItem("user", JSON.stringify(minimalUser));
        
        setUser(minimalUser);
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setHotelData(null);
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
        fetchHotelData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);