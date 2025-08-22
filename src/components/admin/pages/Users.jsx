import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:4000/api";

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: "", password: "", role: "staff" });

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`);
      const data = await res.json();
      setUsers(data.filter(u => u.hotelId === user.hotelId)); // show only same hotel
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/admin/add-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          hotelId: user.hotelId // ✅ same hotel
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("User added");
        setFormData({ username: "", password: "", role: "staff" });
        fetchUsers();
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (err) {
      toast.error("Error adding user");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        User Management - {user.hotelId}
      </h2>

      {/* Add User Form */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <form onSubmit={handleAddUser} className="flex gap-3">
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="px-3 py-2 rounded border w-1/3"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-3 py-2 rounded border w-1/3"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="px-3 py-2 rounded border"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded text-white bg-orange-500 hover:bg-orange-600"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-white p-4 rounded-lg shadow">
        {users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-600 border-b">
                <th className="p-3">Username</th>
                <th className="p-3">Hotel ID</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.hotelId}</td>
                  <td className="p-3">{u.role || "staff"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;
