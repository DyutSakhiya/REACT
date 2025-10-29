import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../admin/Sidebar";
import Header from "../../admin/Header";
import Dashboard from "../../admin/Dashboard";
import Tables from "../../admin/Tables";

export default function AdminPanel() {
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
              {/* Add other routes as needed */}
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}