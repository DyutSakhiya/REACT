import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { UserPlus, Users as UsersIcon, RefreshCw } from "lucide-react";

const API_URL = "http://localhost:4000/api";

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
    if (!user) {
      console.log("No user found, skipping fetch");
      return;
    }
    
    setFetchLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("🔐 Token from localStorage:", token ? "Present" : "Missing");
      console.log("👤 Current user:", user);
      
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      console.log("📡 Response status:", response.status);
      
      if (response.status === 403) {
        const errorData = await response.json();
        console.error("❌ Access denied:", errorData);
        toast.error("Access denied: Admin privileges required");
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("✅ Success response data:", data);

      if (Array.isArray(data)) {
        
        const filteredUsers = data.filter((u) => u.hotelId === user.hotelId);
        console.log("👥 Filtered users:", filteredUsers);
        setUsers(filteredUsers);
        toast.success(`Loaded ${filteredUsers.length} users`);
      } else {
        setUsers([]);
        console.error("Invalid response format:", data);
        toast.error("Invalid response from server");
      }
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
      setUsers([]);
      toast.error(`Failed to fetch users: ${err.message}`);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔄 User changed:", user);
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    if (user?.role !== 'admin') {
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
        body: JSON.stringify({
          ...formData,
          hotelId: user.hotelId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("User added successfully");
        setFormData({ name: "", mobile: "", password: "", role: "staff" });
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to add user");
      }
    } catch (err) {
      console.error("Error adding user:", err);
      toast.error("Error adding user - please try again");
    } finally {
      setAddingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-center py-10 text-red-500 text-lg">
          You must be logged in to see this page.
        </p>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
          <p className="text-red-600">
            Admin privileges are required to access user management. 
            Your current role is: <strong>{user.role}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
    
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UsersIcon className="w-7 h-7 text-orange-500" />
          User Management
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchUsers}
            disabled={fetchLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-blue-500 hover:bg-blue-600 shadow-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${fetchLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
            Hotel ID: {user.hotelId}
          </span>
        </div>
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
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
            autoComplete="name"
            required
          />
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
            autoComplete="tel"
            required
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
            autoComplete="new-password"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
          <button
            type="submit"
            disabled={addingUser}
            className="px-4 py-2 rounded-xl text-white bg-orange-500 hover:bg-orange-600 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        ) : !Array.isArray(users) || users.length === 0 ? (
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
                  <th className="p-3 font-medium rounded-l-xl">Name</th>
                  <th className="p-3 font-medium">Mobile</th>
                  <th className="p-3 font-medium">Hotel ID</th>
                  <th className="p-3 font-medium rounded-r-xl">Role</th>
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
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          u.role === "manager"
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
  );
};

export default Users;