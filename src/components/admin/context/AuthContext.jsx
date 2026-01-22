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

  /* ---------- Helper function to upload image ---------- */
  const uploadImage = async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
        // Note: Don't set Content-Type header for FormData, browser will set it automatically
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Image upload failed");
      }

      const data = await response.json();
      // Expecting response: { success: true, url: "https://example.com/image.jpg" }
      return data.url;
    } catch (err) {
      console.error("Image upload error:", err);
      throw err;
    }
  };

  /* ---------- register – with separate image upload ---------- */
  const register = async (name, mobile, password, hotelname, imageFile = null) => {
    try {
      let logoUrl = null;

      // Upload image first if provided
      if (imageFile) {
        try {
          logoUrl = await uploadImage(imageFile);
        } catch (uploadErr) {
          alert("Failed to upload logo. Please try again or skip logo.");
          return false;
        }
      }

      // Prepare registration payload with URL (not base64)
      const payload = { 
        name, 
        mobile, 
        password, 
        hotelname, 
        hotelLogo: logoUrl // Store URL instead of base64
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
        // Assuming data.user.hotelLogo now contains a URL
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
    // Now hotelLogo should be a direct URL string
    if (hotelLogo) {
      return hotelLogo; // Direct URL
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