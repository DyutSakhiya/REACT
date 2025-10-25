import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();


const API_URL = "https://backend-inky-gamma-67.vercel.app/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  
  const register = async (name, mobile, password) => {
    try {
      const response = await fetch(`${API_URL}/admin/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, password }),
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
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);