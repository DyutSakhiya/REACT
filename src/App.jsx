import React from "react";
import Axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Success from "./pages/Success";
import Error from "./pages/Error";
import Login from "./components/admin/pages/Login";
import Register from "./components/admin/pages/Register";
import Products from "./components/admin/pages/Products";
import { AuthProvider, useAuth } from "./components/admin/context/AuthContext";
import Users from "./components/admin/pages/Users";
import Orders from "./components/admin/pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import Tables from "./components/admin/Tables";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import QRCodeGenerator from "./pages/QRCodeGenerator";

import Sidebar from "./components/admin/Sidebar";
import Header from "./components/admin/Header";
import Dashboard from "./components/admin/Dashboard";

// --- MERGED ADMIN PANEL COMPONENT (from AdminPanel.jsx) ---
function AdminPanel() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="mb-8">
                      <h2 className="text-3xl font-extrabold text-gray-800">
                        Welcome {user.username}
                      </h2>
                    </div>
                    <Dashboard />
                  </>
                }
              />
              <Route path="/tables" element={<Tables />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
// --- END MERGED COMPONENT ---

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/success" element={<Success />} />

          {/* Admin section */}
          <Route path="/admin/*" element={<AdminPanel />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/orders" element={<Orders />} />

          {/* Other routes */}
          <Route path="/tables" element={<Tables />} />
          <Route path="/ProtectedRoute" element={<ProtectedRoute />} />
          <Route path="/ProtectedAdminRoute" element={<ProtectedAdminRoute />} />
          <Route path="/QRCodeGenerator" element={<QRCodeGenerator />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
