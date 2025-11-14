import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import Sidebar from "../admin/Sidebar";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";
// const API_URL = "http://localhost:4000/api";

function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchTables = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user || !user.hotelId) {
        console.error("User data or hotelId not found");
        return;
      }

      const res = await fetch(`${API_URL}/admin/tables?hotelId=${user.hotelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTables(data.tables);
      } else {
        console.error("Error fetching tables:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    
    const interval = setInterval(fetchTables, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "available" ? "occupied" : "available";
    try {
      const res = await fetch(`${API_URL}/admin/tables/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setTables((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error("Error toggling table:", err);
    }
  };

  const addTable = async () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    
    if (!user || !user.hotelId) {
      console.error("User data or hotelId not found");
      return;
    }

    const existingNumbers = tables.map(t => t.tableNumber);
    const tableNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    try {
      const res = await fetch(`${API_URL}/admin/tables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tableNumber,
          capacity: 4,
          location: "Main Hall",
          hotelId: user.hotelId
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTables((prev) => [...prev, data.table]);
      } else {
        console.error("Error adding table:", data.message);
      }
    } catch (err) {
      console.error("Error adding table:", err);
    }
  };

  const deleteTable = async () => {
    if (tables.length === 0) return;
    const lastTable = tables[tables.length - 1];
    try {
      const res = await fetch(`${API_URL}/admin/tables/${lastTable._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTables((prev) => prev.slice(0, -1));
      }
    } catch (err) {
      console.error("Error deleting table:", err);
    }
  };

  const refreshTables = () => {
    fetchTables();
  };

  return (
    <>
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Table Management</h1>

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={addTable}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <PlusCircle className="w-5 h-5" /> Add Table
          </button>
          <button
            onClick={deleteTable}
            disabled={tables.length === 0}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 disabled:opacity-50 transition"
          >
            <Trash2 className="w-5 h-5" /> Delete Last
          </button>
          
        </div>

        {loading ? (
          <div className="text-gray-600 mt-10">Loading tables...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-5xl">
            {tables.map((table) => (
              <div
                key={table._id}
                onClick={() => toggleStatus(table._id, table.status)}
                className={`cursor-pointer flex flex-col items-center justify-center rounded-xl p-6 shadow-md transition-transform hover:-translate-y-1 duration-200 text-center border
                  ${
                    table.status === "occupied"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-green-50 text-green-700 border-green-200"
                  }`}
              >
                <div className="text-lg font-bold mb-2">
                  Table {table.tableNumber}
                </div>
                {table.status === "occupied" ? (
                  <div className="flex items-center gap-1 text-sm">
                    <XCircle className="w-4 h-4" /> Occupied
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-sm">
                    <CheckCircle className="w-4 h-4" /> Available
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Capacity: {table.capacity}
                </div>
                {table.occupiedSince && (
                  <div className="text-xs text-gray-400 mt-1">
                    Since: {new Date(table.occupiedSince).toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Click a table to toggle status · Add or delete tables anytime
          </p>
          <p className="mt-2 text-green-600 text-xs font-medium">
            ✅ Table status updates automatically when orders are created/completed
          </p>
          <p className="mt-1 text-gray-400 text-xs">
            • Order created → Table automatically becomes OCCUPIED
          </p>
          <p className="text-gray-400 text-xs">
            • Bill downloaded → Table automatically becomes AVAILABLE
          </p>
        </div>
      </div>
    </>
  );
}

export default TableManagement;