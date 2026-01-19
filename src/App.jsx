import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Success from "./pages/Success";
import Error from "./pages/Error";
import Login from "./components/admin/pages/Login";
import Register from "./components/admin/pages/Register";
import AdminPanel from "./components/admin/pages/AdminPanel";
import Products from "./components/admin/pages/Products";
import { AuthProvider } from "./components/admin/context/AuthContext";
import Users from "./components/admin/pages/Users";
import Orders from "./components/admin/pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import Tables from "./components/admin/Tables";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import QRCodeGenerator from "./pages/QRCodeGenerator";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="tables" element={<Tables />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/ProtectedRoute" element={<ProtectedRoute />} />
          <Route path="/ProtectedAdminRoute" element={<ProtectedAdminRoute />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/QRCodeGenerator" element={<QRCodeGenerator />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;