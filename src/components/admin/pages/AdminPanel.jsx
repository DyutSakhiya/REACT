import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../admin/Sidebar";
import Header from "../../admin/Header";
import Dashboard from "../../admin/Dashboard";

export default function AdminPanel() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-800">
                Welcome back, {user.username}
              </h2>
              <p className="text-gray-600 mt-2">
                {user.isSuperAdmin
                  ? "Super Admin - Access to all hotels"
                  : `Hotel ID: ${user.hotelId} - Here's what's happening with your store today.`}
              </p>
            </div>
            <Dashboard />
            <div className="mt-8 grid grid-cols-1 gap-8">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-semibold mb-4">
                  {user.isSuperAdmin
                    ? "All Hotels Overview"
                    : `Recent Activity - Hotel ${user.hotelId}`}
                </h3>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
