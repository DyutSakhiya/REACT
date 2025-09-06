import React, { useEffect, useState } from "react";
import Axios from "axios";
import jsPDF from "jspdf";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    Axios.get("http://localhost:4000/api/admin/orders")
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => console.error("Failed to fetch orders", err));
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.qty * item.price, 0);
  };

  const handleDownload = async (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Order Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 20, 40);
    doc.text(`User: ${order.userId || "Guest"}`, 20, 50);
    doc.text(`Hotel ID: ${order.hotelId || "N/A"}`, 20, 60);
    doc.text(
      `Date: ${
        order.timestamp ? new Date(order.timestamp).toLocaleString() : "N/A"
      }`,
      20,
      70
    );

    doc.text("Items:", 20, 90);
    let y = 100;
    order.cartItems?.forEach((item) => {
      doc.text(`${item.name} × ${item.qty} - ₹${item.price * item.qty}`, 25, y);
      y += 10;
    });

    doc.text(
      `Total: ₹${calculateTotal(order.cartItems || [])}`,
      20,
      y + 10
    );

    doc.save(`Order_${order.orderId}.pdf`);

    try {
      await Axios.put(`http://localhost:4000/api/orders/${order._id}/complete`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );

  const renderTable = (list, isPending) => (
    <div className="overflow-x-auto mt-4">
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">User</th>
            <th className="px-4 py-2 border">Hotel ID</th>
            <th className="px-4 py-2 border">Items</th>
            <th className="px-4 py-2 border">Total (₹)</th>
            <th className="px-4 py-2 border">Status</th>
            {isPending && <th className="px-4 py-2 border">Download</th>}
          </tr>
        </thead>
        <tbody>
          {list.map((order) => (
            <tr key={order._id}>
              <td className="px-4 py-2 border">{order.orderId}</td>
              <td className="px-4 py-2 border">{order.userId || "Guest"}</td>
              <td className="px-4 py-2 border">{order.hotelId || "N/A"}</td>
              <td className="px-4 py-2 border">
                <ul className="list-disc ml-5">
                  {order.cartItems?.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.qty} (₹{item.price})
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-2 border font-bold text-green-600">
                ₹{calculateTotal(order.cartItems || [])}
              </td>
              <td className="px-4 py-2 border">{order.status}</td>
              {isPending && (
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => handleDownload(order)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Download
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Orders Management</h1>

      <div className="flex gap-4 mb-5">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded ${
            activeTab === "pending"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Pending Orders ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded ${
            activeTab === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Completed Orders ({completedOrders.length})
        </button>
      </div>

      {activeTab === "pending"
        ? renderTable(pendingOrders, true)
        : renderTable(completedOrders, false)}
    </div>
  );
};

export default Orders;
