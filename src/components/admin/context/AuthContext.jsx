import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

import { API_URL } from "../../../helper";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentHotelId, setCurrentHotelId] = useState(null);
  const [tableId, setTableId] = useState(null);

  // Function to get URL parameters
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    const hotelId = params.get('hotel_id');
    const tableId = params.get('table_id');
    
    console.log("URL Parameters - hotel_id:", hotelId, "table_id:", tableId);
    return { hotelId, tableId };
  };

  // Initialize - check URL params first, then localStorage
  useEffect(() => {
    const initialize = async () => {
      try {
        // Get parameters from URL
        const { hotelId: urlHotelId, tableId: urlTableId } = getUrlParams();
        
        // Set tableId from URL
        if (urlTableId) {
          setTableId(urlTableId);
          localStorage.setItem("tableId", urlTableId);
        }

        // Priority 1: Hotel ID from URL parameter
        if (urlHotelId) {
          console.log("Using hotel_id from URL:", urlHotelId);
          setCurrentHotelId(urlHotelId);
          localStorage.setItem("currentHotelId", urlHotelId);
          await fetchHotelData(urlHotelId);
        } 
        // Priority 2: Hotel ID from localStorage (if user is logged in)
        else {
          const token = localStorage.getItem("token");
          const userData = localStorage.getItem("user");
          const storedHotelId = localStorage.getItem("currentHotelId");

          if (token && userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              
              const hotelId = storedHotelId || parsedUser.hotelId;
              if (hotelId) {
                console.log("Using hotel_id from localStorage:", hotelId);
                setCurrentHotelId(hotelId);
                if (!storedHotelId) {
                  localStorage.setItem("currentHotelId", hotelId);
                }
                await fetchHotelData(hotelId);
              }
            } catch (error) {
              console.error("Error parsing user data:", error);
              clearLocalStorage();
            }
          }
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // Listen for URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      const { hotelId: urlHotelId, tableId: urlTableId } = getUrlParams();
      
      // Update tableId if changed
      if (urlTableId && urlTableId !== tableId) {
        setTableId(urlTableId);
        localStorage.setItem("tableId", urlTableId);
      }
      
      // Update hotelId if changed
      if (urlHotelId && urlHotelId !== currentHotelId) {
        console.log("URL changed to hotel:", urlHotelId);
        setCurrentHotelId(urlHotelId);
        localStorage.setItem("currentHotelId", urlHotelId);
        fetchHotelData(urlHotelId);
      }
    };

    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleUrlChange);
    
    // Check URL on mount
    handleUrlChange();

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [currentHotelId, tableId]);

  // Function to fetch hotel data
  const fetchHotelData = async (hotelId) => {
    if (!hotelId) return;
    
    console.log(`Fetching hotel data for: ${hotelId}`);
    
    try {
      const response = await fetch(`${API_URL}/hotel/${hotelId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Hotel data received:", data);
      
      if (data.success) {
        setHotelData(data);
      } else {
        console.error("Failed to fetch hotel:", data.message);
        setHotelData({
          success: false,
          hotelId: hotelId,
          hotelname: `Hotel ${hotelId}`,
          message: data.message
        });
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      setHotelData({
        success: false,
        hotelId: hotelId,
        hotelname: `Hotel ${hotelId}`,
        message: "Network error"
      });
    }
  };

  // Clear localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Don't remove currentHotelId as it might come from URL
  };

  // Register function
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
        if (data.hotelId || data.user?.hotelId) {
          const hotelId = data.hotelId || data.user.hotelId;
          setCurrentHotelId(hotelId);
          localStorage.setItem("currentHotelId", hotelId);
        }
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

  // Login function
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
        
        if (data.user.hotelId) {
          setCurrentHotelId(data.user.hotelId);
          localStorage.setItem("currentHotelId", data.user.hotelId);
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

  // Logout function
  const logout = () => {
    clearLocalStorage();
    setUser(null);
    setHotelData(null);
    // Don't reset currentHotelId as it might come from URL
  };

  // Update hotel from URL
  const updateHotelFromUrl = () => {
    const { hotelId: urlHotelId } = getUrlParams();
    if (urlHotelId && urlHotelId !== currentHotelId) {
      setCurrentHotelId(urlHotelId);
      localStorage.setItem("currentHotelId", urlHotelId);
      fetchHotelData(urlHotelId);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      hotelData, 
      currentHotelId, 
      tableId,
      login, 
      register, 
      logout, 
      updateHotelFromUrl,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);