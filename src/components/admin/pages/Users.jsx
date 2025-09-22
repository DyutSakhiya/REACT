import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { UserPlus, Users as UsersIcon } from "lucide-react";

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

  // ✅ Fetch Users
  const fetchUsers = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        // filter users by same hotelId
        setUsers(data.filter((u) => u.hotelId === user.hotelId));
      } else {
        setUsers([]);
        console.error("Invalid response:", data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  // ✅ Handle Input Change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.password) {
      toast.error("Fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          hotelId: user.hotelId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("User added");
        setFormData({ name: "", mobile: "", password: "", role: "staff" });
        fetchUsers();
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (err) {
      toast.error("Error adding user");
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!user) {
    return (
      <p className="text-center py-10 text-red-500">
        You must be logged in to see this page.
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <UsersIcon className="w-7 h-7 text-orange-500" />
          User Management
        </h2>
        <span className="text-sm px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
          Hotel ID: {user.hotelId}
        </span>
      </div>

      {/* Add User Form */}
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
            placeholder="Name"
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
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
            className="px-4 py-2 rounded-xl text-white bg-orange-500 hover:bg-orange-600 shadow-md transition"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        {!Array.isArray(users) || users.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No users found.</p>
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
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium">{u.name}</td>
                    <td className="p-3">{u.mobile}</td>
                    <td className="p-3">{u.hotelId}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          u.role === "manager"
                            ? "bg-green-100 text-green-700"
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
