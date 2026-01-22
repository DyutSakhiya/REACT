import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "react-hot-toast";
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
          <div className="min-h-screen bg-gray-50">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
            
            <Routes>
              {/* Hotel-specific routes (works on both mobile & laptop) */}
              <Route path="/hotel/:hotelId" element={
                <>
                  <Navbar />
                  <Home />
                </>
              } />
              
              {/* Alternative hotel route */}
              <Route path="/menu/:hotelId" element={
                <>
                  <Navbar />
                  <Home />
                </>
              } />
              
              {/* Default route (for registered users) */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                </>
              } />
              
              {/* Success page with hotel ID */}
              <Route path="/success/:hotelId" element={
                <>
                  <Navbar />
                  <Success />
                </>
              } />
              
              {/* Success page without hotel ID */}
              <Route path="/success" element={
                <>
                  <Navbar />
                  <Success />
                </>
              } />
              
              {/* Auth pages (no navbar for clean UI) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* QR Code Generator */}
              <Route path="/qrcode/:hotelId" element={<QRCodeGenerator />} />
              <Route path="/qrcode" element={<QRCodeGenerator />} />
              
              {/* Admin routes - protected */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedAdminRoute>
                    <AdminPanel />
                  </ProtectedAdminRoute>
                } 
              />
              
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedAdminRoute>
                    <Products />
                  </ProtectedAdminRoute>
                } 
              />
              
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedAdminRoute>
                    <Users />
                  </ProtectedAdminRoute>
                } 
              />
              
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedAdminRoute>
                    <Orders />
                  </ProtectedAdminRoute>
                } 
              />
              
              <Route 
                path="/admin/tables" 
                element={
                  <ProtectedAdminRoute>
                    <Tables />
                  </ProtectedAdminRoute>
                } 
              />
              
              {/* Protected route example */}
              <Route 
                path="/protected" 
                element={
                  <ProtectedRoute>
                    <div className="p-8">
                      <h1 className="text-2xl font-bold">Protected Page</h1>
                    </div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Error page */}
              <Route path="*" element={<Error />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;