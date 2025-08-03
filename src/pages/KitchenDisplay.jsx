import React, { useState } from 'react';
import { FaCheck, FaClock, FaUtensils } from 'react-icons/fa';

const AdminKitchenDisplay = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD-123456",
      table: 5,
      items: [
        { name: "Paneer Butter Masala", qty: 2, status: "preparing" },
        { name: "Garlic Naan", qty: 4, status: "ready" }
      ],
      time: "12:30 PM"
    },
    {
      id: "ORD-789012",
      table: 3,
      items: [
        { name: "Veg Biryani", qty: 1, status: "preparing" },
        { name: "Raita", qty: 1, status: "preparing" }
      ],
      time: "12:45 PM"
    }
  ]);

  const markAsReady = (orderId, itemName) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map(item => 
            item.name === itemName ? { ...item, status: "ready" } : item
          )
        };
      }
      return order;
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <FaUtensils /> Kitchen Display
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
              <h2 className="text-xl font-semibold">
                Order #{order.id}
              </h2>
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Table {order.table}
              </span>
            </div>
            
            <div className="mb-3 text-sm text-gray-500 flex items-center gap-2">
              <FaClock /> {order.time}
            </div>
            
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li key={item.name} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-400 text-sm ml-2">× {item.qty}</span>
                  </div>
                  {item.status === "ready" ? (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <FaCheck /> Ready
                    </span>
                  ) : (
                    <button 
                      onClick={() => markAsReady(order.id, item.name)}
                      className="bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Mark Ready
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminKitchenDisplay;