import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  
  const register = async (name, mobile, password) => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/register", {
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
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();
      if (data.success) {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
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
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);