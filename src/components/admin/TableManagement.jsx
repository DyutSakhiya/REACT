import React, { useState, useEffect } from "react";
import { Table, Clock, CheckCircle, XCircle, RefreshCw, Users } from "lucide-react";
import { useAuth } from "./context/AuthContext";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  // Mock data for tables
  const mockTables = Array.from({ length: 10 }, (_, i) => ({
    _id: `table-${i + 1}`,
    tableNumber: i + 1,
    status: 'available',
    capacity: i < 5 ? 4 : 6,
    location: i < 3 ? 'Main Hall' : i < 7 ? 'Terrace' : 'Private Room',
    occupiedSince: null
  }));

  useEffect(() => {
    if (user?.hotelId) {
      fetchTableStatus();
    }
  }, [user]);

  const fetchTableStatus = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data since API endpoint doesn't exist
      setTables([...mockTables]);
      
    } catch (error) {
      console.error("Failed to fetch table status:", error);
      // Fallback to mock data even if there's an error
      setTables([...mockTables]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTableStatus();
  };

  const updateTableStatus = async (tableId, newStatus) => {
    try {
      // Update local state immediately for better UX
      setTables(prevTables => 
        prevTables.map(table => 
          table._id === tableId 
            ? { 
                ...table, 
                status: newStatus, 
                occupiedSince: newStatus === 'occupied' ? new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : null 
              }
            : table
        )
      );

      // Simulate API call - in real implementation, uncomment below
      // await Axios.put(`${API_URL}/admin/tables/${tableId}`, {
      //   status: newStatus,
      //   hotelId: user.hotelId
      // });
      
      console.log(`Table ${tableId} status updated to: ${newStatus}`);
      
    } catch (error) {
      console.error("Failed to update table status:", error);
      // Revert local state if API call fails
      fetchTableStatus();
    }
  };

  const getStatusColor = (status) => {
    return status === 'available' 
      ? { 
          bg: 'bg-green-50', 
          border: 'border-green-300', 
          text: 'text-green-700', 
          dot: 'bg-green-500',
          button: 'bg-green-500 hover:bg-green-600'
        }
      : { 
          bg: 'bg-red-50', 
          border: 'border-red-300', 
          text: 'text-red-700', 
          dot: 'bg-red-500',
          button: 'bg-red-500 hover:bg-red-600'
        };
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading table status...</p>
      </div>
    );
  }

  const availableTables = tables.filter(table => table.status === 'available').length;
  const occupiedTables = tables.filter(table => table.status === 'occupied').length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Table size={24} className="text-orange-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Table Management</h2>
              <p className="text-gray-600 text-sm">Manual table status control</p>
            </div>
          </div>
          
        </div>

        {/* Table Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-semibold">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableTables}</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-800 font-semibold">Occupied</p>
                <p className="text-2xl font-bold text-red-600">{occupiedTables}</p>
              </div>
              <XCircle size={24} className="text-red-500" />
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-800 font-semibold">Total Tables</p>
                <p className="text-2xl font-bold text-blue-600">{tables.length}</p>
              </div>
              <Table size={24} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-800 font-semibold">Occupancy Rate</p>
                <p className="text-2xl font-bold text-orange-600">
                  {tables.length > 0 ? ((occupiedTables / tables.length) * 100).toFixed(0) : 0}%
                </p>
              </div>
              <Users size={24} className="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Table size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-blue-800 font-semibold">Admin Control Panel</p>
              <p className="text-blue-700 text-sm mt-1">
                Click the status buttons below each table to manually update its occupancy status. 
                Tables will NOT change status automatically. All changes are saved immediately.
              </p>
              <p className="text-blue-600 text-xs mt-2">
                💡 <strong>Note:</strong> Using mock data. Connect to backend API when available.
              </p>
            </div>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {tables.map((table) => {
            const colors = getStatusColor(table.status);
            return (
              <div
                key={table._id}
                className={`p-4 rounded-xl border-2 transition-all ${colors.bg} ${colors.border} hover:shadow-md`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {/* Table Icon and Number */}
                  <div className="relative">
                    <Table size={36} className={colors.text} />
                    <div className="absolute -top-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center border shadow-sm">
                      <span className="text-xs font-bold">{table.tableNumber}</span>
                    </div>
                  </div>

                  {/* Table Details */}
                  <div className="text-center">
                    <h3 className="font-bold text-lg text-gray-800">Table {table.tableNumber}</h3>
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mt-1">
                      <Users size={12} />
                      <span>Seats {table.capacity}</span>
                      <span>•</span>
                      <span>{table.location}</span>
                    </div>
                  </div>

                  {/* Status Display */}
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                    <span className={`text-sm font-medium ${colors.text}`}>
                      {table.status === 'available' ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  
                  {/* Occupied Since */}
                  {table.status === 'occupied' && table.occupiedSince && (
                    <div className="flex items-center space-x-1 text-xs text-gray-600 bg-white px-2 py-1 rounded-full">
                      <Clock size={10} />
                      <span>Since {table.occupiedSince}</span>
                    </div>
                  )}

                  {/* Status Control Buttons */}
                  <div className="flex flex-col space-y-2 w-full mt-2">
                    <button
                      onClick={() => updateTableStatus(table._id, 'available')}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                        table.status === 'available'
                          ? 'bg-green-500 text-white shadow-sm cursor-default'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white border border-gray-200'
                      }`}
                      disabled={table.status === 'available'}
                    >
                      {table.status === 'available' ? 'Available' : 'Mark Available'}
                    </button>
                    <button
                      onClick={() => updateTableStatus(table._id, 'occupied')}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors font-medium ${
                        table.status === 'occupied'
                          ? 'bg-red-500 text-white shadow-sm cursor-default'
                          : 'bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white border border-gray-200'
                      }`}
                      disabled={table.status === 'occupied'}
                    >
                      {table.status === 'occupied' ? 'Occupied' : 'Mark Occupied'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

       
      </div>
    </div>
  );
};

export default TableManagement;