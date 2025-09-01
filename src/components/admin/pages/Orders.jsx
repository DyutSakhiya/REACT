import React, { useEffect, useState } from "react";
import Axios from "axios";
import jsPDF from "jspdf";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:4000/api/admin/orders")
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => console.error("Failed to fetch orders", err));
  }, []);

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.qty * item.price, 0);
  };

  const handleDownload = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Order Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 20, 40);
    doc.text(`User: ${order.userId || "Guest"}`, 20, 50);
    doc.text(`Hotel ID: ${order.hotelId}`, 20, 60);
    doc.text(`Date: ${new Date(order.timestamp).toLocaleString()}`, 20, 70);

    doc.text("Items:", 20, 90);
    let y = 100;
    order.cartItems.forEach((item) => {
      doc.text(
        `${item.name} × ${item.qty} - ₹${item.price * item.qty}`,
        25,
        y
      );
      y += 10;
    });

    doc.text(
      `Total: ₹${calculateTotal(order.cartItems)}`,
      20,
      y + 10
    );

    doc.save(`Order_${order.orderId}.pdf`);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Hotel ID</th>
                <th className="px-4 py-2 border">Items</th>
                <th className="px-4 py-2 border">Total (₹)</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Download</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-2 border">{order.orderId}</td>
                  <td className="px-4 py-2 border">{order.userId}</td>
                  <td className="px-4 py-2 border">{order.hotelId}</td>
                  <td className="px-4 py-2 border">
                    <ul className="list-disc ml-5">
                      {order.cartItems.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.qty} (₹{item.price})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 border font-bold text-green-600">
                    ₹{calculateTotal(order.cartItems)}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(order.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDownload(order)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
