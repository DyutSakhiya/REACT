
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { UserPlus, Users as UsersIcon, Home, ShoppingCart, Package, Table, Menu, X as CloseIcon, Building2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { API_URL } from "../../../helper";

// Integrated Sidebar Component
const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: UsersIcon, label: "Users", path: "/admin/users" },
    { icon: Table, label: "Tables", path: "/admin/tables" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const hotelName = user?.hotelname || user?.hotelName || "Flavaro Admin";
  
  // Get hotel logo from user data
  const hotelLogo = user?.hotelLogo;
  
  // Function to get logo URL
  const getLogoUrl = () => {
    if (hotelLogo && hotelLogo.data) {
      return `data:${hotelLogo.contentType};base64,${hotelLogo.data}`;
    }
    return null;
  };

  const logoUrl = getLogoUrl();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Hotel Logo" 
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <Building2 className="text-orange-600" size={20} />
          )}
          <h2 className="text-lg font-bold text-orange-600 truncate max-w-[180px]">
            {hotelName}
          </h2>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg border border-gray-200"
        >
          {isMobileOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r p-4 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-64 w-64
      `}>
        {/* Desktop Title - Hidden on mobile */}
        <div className="mb-8 px-4 hidden lg:block">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Hotel Logo" 
                className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
              />
            ) : (
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="text-orange-600" size={24} />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {hotelName}
              </h2>
              <p className="text-xs text-gray-500">Hotel Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Hotel Logo" 
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <Building2 className="text-orange-600" size={20} />
            )}
            <h2 className="text-lg font-bold text-orange-600 truncate max-w-[180px]">
              {hotelName}
            </h2>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg border border-gray-200"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

const Users = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    role: "staff",
  });
  const [fetchLoading, setFetchLoading] = useState(false);
  const [addingUser, setAddingUser] = useState(false);

  const fetchUsers = async () => {
    if (!user) return;

    setFetchLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        const filtered = data.filter((u) => u.hotelId === user.hotelId);
        setUsers(filtered);
      } else {
        setUsers([]);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
      setUsers([]);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") fetchUsers();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (user?.role !== "admin") {
      toast.error("Only admins can add users");
      return;
    }

    setAddingUser(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/admin/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, hotelId: user.hotelId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("User added successfully");
        setFormData({ name: "", mobile: "", password: "", role: "staff" });
        fetchUsers();
      } else toast.error(data.message || "Failed to add user");
    } catch (err) {
      toast.error("Error adding user");
    } finally {
      setAddingUser(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );

  if (!user)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-center py-10 text-red-500 text-lg">
          You must be logged in to see this page.
        </p>
      </div>
    );

  if (user.role !== "admin")
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600">
            Admin privileges are required. Your current role:{" "}
            <strong>{user.role}</strong>
          </p>
        </div>
      </div>
    );

  return (
    <>
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1 max-w-7xl mx-auto p-6 mt-16 lg:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <UsersIcon className="w-7 h-7 text-orange-500" />
              User Management
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-500" /> Add New User
            </h3>
            <form
              onSubmit={handleAddUser}
              className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
                required
              />
              <input
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
                required
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
              </select>
              <button
                type="submit"
                disabled={addingUser}
                className="px-4 py-2 rounded-xl text-white bg-orange-500 hover:bg-orange-600 shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addingUser ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  "Add User"
                )}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Users ({users.length})
              </h3>
              {fetchLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  Loading...
                </div>
              )}
            </div>

            {fetchLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No users found for your hotel.</p>
                <button
                  onClick={fetchUsers}
                  className="mt-3 px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Mobile</th>
                      <th className="p-3 font-medium">Hotel ID</th>
                      <th className="p-3 font-medium">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, index) => (
                      <tr
                        key={u._id || index}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-3 font-medium">{u.name}</td>
                        <td className="p-3">{u.mobile}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                            {u.hotelId}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${u.role === "manager"
                                ? "bg-green-100 text-green-700"
                                : u.role === "admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                          >
                            {u.role || "staff"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
