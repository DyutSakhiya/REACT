import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/Store";
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
import Navbar from "./components/Navbar";

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Hotel-specific route (for mobile access) */}
            <Route path="/hotel/:hotelId" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            
            {/* Default route */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            
            {/* Success page */}
            <Route path="/success" element={<Success />} />
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={<AdminPanel />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/tables" element={<Tables />} />
            
            {/* QR Code */}
            <Route path="/QRCodeGenerator" element={<QRCodeGenerator />} />
            
            {/* Error page */}
            <Route path="*" element={<Error />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;