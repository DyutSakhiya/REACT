// context/AuthContext.js
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Register new user with name + mobile + password
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

  // Login with mobile + password
  const login = async (mobile, password) => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
