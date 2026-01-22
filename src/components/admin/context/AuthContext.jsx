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
      // TEMPORARY WORKAROUND: Convert to base64 and send in registration
      // This avoids the CORS issue by not making a separate upload request
      console.log("Using base64 workaround due to CORS restrictions");
      
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Get the base64 string (without data:url prefix)
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      
      // Return a placeholder object that will be handled by register function
      return {
        data: base64String,
        contentType: imageFile.type,
        isBase64: true
      };
      
      // ORIGINAL CODE (commented out due to CORS):
      /*
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Image upload failed");
      }

      const data = await response.json();
      return data.url;
      */
    } catch (err) {
      console.error("Image upload error:", err);
      throw err;
    }
  };

  /* ---------- register – with image handling ---------- */
  const register = async (name, mobile, password, hotelname, imageFile = null) => {
    try {
      let hotelLogo = null;

      // Upload image if provided
      if (imageFile) {
        try {
          const imageData = await uploadImage(imageFile);
          
          // Check if it's base64 data or URL
          if (imageData.isBase64) {
            // Store as base64 object (compatible with existing backend)
            hotelLogo = {
              data: imageData.data,
              contentType: imageData.contentType
            };
          } else {
            // Store as URL string
            hotelLogo = imageData;
          }
        } catch (uploadErr) {
          console.warn("Logo upload failed, proceeding without logo:", uploadErr);
          // Continue registration without logo
        }
      }

      // Prepare registration payload
      const payload = { 
        name, 
        mobile, 
        password, 
        hotelname, 
        hotelLogo
      };

      console.log("Sending registration payload:", { ...payload, hotelLogo: hotelLogo ? "[LOGO_DATA]" : null });

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

  /* ---------- Alternative register without separate upload (simpler) ---------- */
  const registerSimple = async (name, mobile, password, hotelname, imageFile = null) => {
    try {
      let hotelLogo = null;
      
      // Convert image to base64 if provided
      if (imageFile) {
        hotelLogo = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            // Get full base64 data URL
            const dataUrl = reader.result;
            // Or just the base64 part: dataUrl.split(",")[1]
            resolve(dataUrl);
          };
          reader.readAsDataURL(imageFile);
        });
      }

      const payload = { 
        name, 
        mobile, 
        password, 
        hotelname, 
        hotelLogo 
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

  /* ---------- helper: logo URL ---------- */
  const getLogoUrl = () => {
    // Handle both URL string and base64 object formats
    if (!hotelLogo) return null;
    
    if (typeof hotelLogo === 'string') {
      // If it's already a URL or data URL
      return hotelLogo;
    } else if (hotelLogo.data) {
      // If it's a base64 object
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
        register: registerSimple, // Using simple version to avoid CORS
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