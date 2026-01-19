import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, Trash2, CheckCircle, XCircle, RefreshCw, Receipt, Printer } from "lucide-react";
import Sidebar from "../admin/Sidebar";
import { API_URL } from "../../helper";

function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const token = localStorage.getItem("token");
  
  // Auto-refresh intervals
  const tablesIntervalRef = useRef(null);
  const ordersIntervalRef = useRef(null);

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

    // Auto-refresh tables every 10 seconds
    tablesIntervalRef.current = setInterval(fetchTables, 10000);

    return () => {
      if (tablesIntervalRef.current) {
        clearInterval(tablesIntervalRef.current);
      }
      if (ordersIntervalRef.current) {
        clearInterval(ordersIntervalRef.current);
      }
    };
  }, []);

  const fetchTablePendingOrders = async (tableNumber) => {
    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      
      if (!user || !user.hotelId) return;

      const response = await fetch(
        `${API_URL}/orders/pending/${user.hotelId}/${tableNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const data = await response.json();
      if (data.success && data.order) {
        setPendingOrders([data.order]); // Wrap in array for consistency
      } else {
        setPendingOrders([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setPendingOrders([]);
    }
  };

  const handleTableClick = async (table) => {
    setSelectedTable(table);
    await fetchTablePendingOrders(table.tableNumber);
    setShowOrdersModal(true);
  };

  // Start orders auto-refresh when modal opens
  useEffect(() => {
    if (showOrdersModal && selectedTable) {
      // Clear any existing interval first
      if (ordersIntervalRef.current) {
        clearInterval(ordersIntervalRef.current);
      }
      
      // Fetch orders immediately
      fetchTablePendingOrders(selectedTable.tableNumber);
      
      // Start auto-refresh every 3 seconds (more frequent)
      ordersIntervalRef.current = setInterval(() => {
        fetchTablePendingOrders(selectedTable.tableNumber);
      }, 3000);
      
      console.log("Auto-refresh started for table", selectedTable.tableNumber);
    }
    
    // Cleanup when modal closes
    return () => {
      if (ordersIntervalRef.current) {
        clearInterval(ordersIntervalRef.current);
        ordersIntervalRef.current = null;
        console.log("Auto-refresh stopped");
      }
    };
  }, [showOrdersModal, selectedTable]);

  const toggleStatus = async (id, currentStatus, event) => {
    event.stopPropagation(); // Prevent triggering table click
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

  const completeOrder = async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh table orders and tables
        if (selectedTable) {
          await fetchTablePendingOrders(selectedTable.tableNumber);
          fetchTables();
        }
      }
    } catch (error) {
      console.error("Error completing order:", error);
    }
  };

  const printThermalBill = (order) => {
    if (!order || !order.cartItems || order.cartItems.length === 0) {
      alert("No items in this order to print");
      return;
    }

    const subtotal = order.cartItems.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
    const gst = subtotal * 0.05;
    const total = subtotal + gst;
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill ${order.orderId || order._id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap');
            body { 
              font-family: 'Roboto Mono', monospace;
              font-size: 14px;
              font-weight: 500;
              line-height: 1.4;
              background: white;
              color: #000;
              margin: 0;
              padding: 20px;
              max-width: 80mm;
              margin: 0 auto;
            }
            .bill-container { text-align: center; }
            .header { margin-bottom: 20px; }
            .restaurant-name { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 5px; 
              letter-spacing: 1px;
              text-transform: uppercase;
            }
            .divider { 
              border-top: 2px dashed #000; 
              margin: 15px 0; 
            }
            .items-table { 
              width: 100%; 
              margin: 15px 0; 
              border-collapse: collapse; 
            }
            .items-table td { 
              padding: 4px 0; 
              border-bottom: 1px dashed #ddd; 
            }
            .item-name { text-align: left; }
            .item-qty { text-align: center; width: 40px; }
            .item-price { text-align: right; width: 60px; }
            .totals { margin-top: 20px; }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              padding: 6px 0; 
              border-bottom: 1px solid #000; 
            }
            .grand-total { 
              font-size: 16px; 
              font-weight: bold; 
              margin-top: 10px; 
              border-top: 2px solid #000;
              padding-top: 10px;
            }
            .footer { 
              margin-top: 30px; 
              font-style: italic;
              text-align: center;
            }
            .table-info {
              background: #f5f5f5;
              padding: 8px;
              border-radius: 4px;
              margin: 10px 0;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 10px; 
                font-size: 13px; 
              }
              .no-print { display: none; }
            }
            .print-btn {
              background: #4CAF50;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <div class="header">
              <div class="restaurant-name">FLAVOROFOODS</div>
              <div>Rajkot - 360004</div>
              <div>Phone: ${user?.mobile || "N/A"}</div>
              <div class="divider"></div>
            </div>
            
            <div class="table-info">
              <div><strong>Table:</strong> ${order.tableNumber || "N/A"}</div>
              <div><strong>Order ID:</strong> ${order.orderId || order._id}</div>
              <div><strong>Date:</strong> ${order.timestamp ? new Date(order.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}</div>
              <div><strong>Time:</strong> ${order.timestamp ? new Date(order.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}</div>
            </div>
            
            <div class="divider"></div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th class="item-name">Item</th>
                  <th class="item-qty">Qty</th>
                  <th class="item-price">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.cartItems.map((item) => `
                  <tr>
                    <td class="item-name">${item.name}</td>
                    <td class="item-qty">${item.qty || 1}${item.quantity > 1 ? ` × ${item.quantity}` : ''}</td>
                    <td class="item-price">₹${(item.price * (item.qty || 1)).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="divider"></div>
            
            <div class="totals">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toFixed(2)}</span>
              </div>
              <div class="total-row">
                <span>GST (5%):</span>
                <span>₹${gst.toFixed(2)}</span>
              </div>
              <div class="grand-total total-row">
                <span>TOTAL:</span>
                <span>₹${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="footer">
              Thank you for dining with us!<br>
              Visit Again!
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 20px;">
              <button class="print-btn" onclick="window.print()">
                🖨️ Print Bill
              </button>
              <button style="background: #666; margin-left: 10px;" onclick="window.close()">
                Close
              </button>
            </div>
          </div>
          
          <script>
            // Auto-print after a short delay
            setTimeout(() => {
              window.print();
            }, 500);
            
            // Close window after printing
            window.onafterprint = function() {
              setTimeout(() => {
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintAndComplete = async (order) => {
    // First print the bill
    printThermalBill(order);
    
    // Then complete the order
    try {
      const response = await fetch(`${API_URL}/orders/${order._id}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        // Refresh the orders list
        if (selectedTable) {
          await fetchTablePendingOrders(selectedTable.tableNumber);
          fetchTables();
        }
        alert("Order completed successfully!");
      } else {
        alert("Failed to complete order. Please try again.");
      }
    } catch (error) {
      console.error("Error completing order:", error);
      alert("Error completing order. Please check console.");
    }
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
                onClick={() => handleTableClick(table)}
                className={`cursor-pointer flex flex-col items-center justify-center rounded-xl p-6 shadow-md transition-transform hover:-translate-y-1 duration-200 text-center border
                  ${table.status === "occupied"
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
                {table.currentOrderId && (
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    Order: {table.currentOrderId.substring(0, 8)}...
                  </div>
                )}
                {table.occupiedSince && (
                  <div className="text-xs text-gray-400 mt-1">
                    Since: {new Date(table.occupiedSince).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                )}
                <button
                  onClick={(e) => toggleStatus(table._id, table.status, e)}
                  className={`mt-3 px-3 py-1 text-xs rounded-lg transition-colors ${table.status === 'occupied' 
                    ? 'bg-red-200 text-red-700 hover:bg-red-300' 
                    : 'bg-green-200 text-green-700 hover:bg-green-300'}`}
                >
                  Toggle Status
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Orders Modal */}
        {showOrdersModal && selectedTable && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Table {selectedTable.tableNumber} - Pending Orders
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Status: <span className={`font-semibold ${selectedTable.status === 'occupied' ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedTable.status.toUpperCase()}
                    </span>
                    {selectedTable.occupiedSince && (
                      <span className="ml-4">
                        Occupied since: {new Date(selectedTable.occupiedSince).toLocaleString()}
                      </span>
                    )}
                  </p>
                  
                </div>
                <button
                  onClick={() => {
                    setShowOrdersModal(false);
                    setSelectedTable(null);
                    setPendingOrders([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {pendingOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No pending orders for this table</p>
                    <p className="text-gray-400 mt-2">All orders are completed</p>
                    <p className="text-green-500 text-sm mt-4 font-medium">
                      ⏳ Auto-refresh is active. New orders will appear automatically.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingOrders.map((order) => (
                      <div key={order._id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                              Order: {order.orderId || order._id}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Created: {new Date(order.timestamp || order.createdAt).toLocaleString()}
                            </p>
                            <p className="text-sm">
                              Status: <span className="font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                {order.status || 'pending'}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Last checked: {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-800">
                              ₹{order.total || order.cartItems?.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0) || 0}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
                          <div className="space-y-2">
                            {order.cartItems?.map((item, index) => (
                              <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    × {item.qty || 1}{item.quantity > 1 ? ` × ${item.quantity}` : ''}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">₹{item.price.toFixed(2)}</div>
                                  <div className="text-sm text-gray-500">
                                    Total: ₹{(item.price * (item.qty || 1)).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => handlePrintAndComplete(order)}
                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex-1 justify-center"
                          >
                            <Printer className="w-4 h-4" />
                            Print Bill & Complete Order
                          </button>
                          
                          
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {pendingOrders.length} pending order{pendingOrders.length !== 1 ? 's' : ''} for Table {selectedTable.tableNumber}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      ✅ Auto-refresh is active. New orders will appear automatically.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Click a table to view pending orders · Add or delete tables anytime
          </p>
          <p className="mt-2 text-blue-600 text-xs font-medium">
            📋 Click on any table to view its pending orders
          </p>
          <p className="mt-1 text-gray-400 text-xs">
            • Print Bill button will also complete the order automatically
          </p>
          <p className="text-gray-400 text-xs">
            • Table status updates automatically when orders are completed
          </p>
          <p className="text-green-500 text-xs font-medium mt-2">
            🔄 Auto-refresh enablex d (Tables: 10s, Orders modal: 3s)
          </p>
        </div>
      </div>
    </>
  );
}

export default TableManagement;