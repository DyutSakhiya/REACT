import React, { useEffect, useMemo, useState } from "react";
import Axios from "axios";
import jsPDF from "jspdf";
import { CalendarDays } from "lucide-react";
import Sidebar from "../Sidebar";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";
// const API_URL = "http://localhost:4000/api";

const SPRING_EASE = "cubic-bezier(0.22, 1, 0.36, 1)"; 

const AnimatedWrap = ({
  mode = "soft",
  className = "",
  as: Tag = "div",
  children,
  ...props
}) => {
  const [style, setStyle] = useState({});
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e) => {
    if (reduceMotion || mode !== "tilt") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = -((y - rect.height / 2) / (rect.height / 2)) * 7;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 7;
    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`,
    });
  };

  const onLeave = () => {
    if (reduceMotion || mode !== "tilt") return;
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)",
    });
  };

  const base =
    "transform-gpu will-change-transform transition-all duration-300 [transition-timing-function:var(--spring-ease)]";
  const soft =
    "hover:scale-[1.015] hover:shadow-[0_10px_26px_rgba(0,0,0,0.08)]";
  const tilt = "hover:shadow-[0_10px_26px_rgba(0,0,0,0.10)]";

  return (
    <Tag
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ ...(mode === "tilt" ? style : {}), ["--spring-ease"]: SPRING_EASE }}
      className={`${base} ${mode === "soft" ? soft : tilt} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

const CuteOrderCard = ({ order,  onPrint, total, animationMode }) => {
  return (
    <AnimatedWrap
      mode={animationMode}
      className="rounded-2xl border border-green-200/60 bg-gradient-to-br from-green-50 via-white to-violet-50 p-4 shadow-sm hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧾</span>
          <div className="font-semibold text-green-700">
            Order #{order.orderId}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span>🍽️</span>
          <span className="text-gray-700">
            Table: <b>{order.tableNumber || "N/A"}</b>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>🏨</span>
          <span className="text-gray-700">
            Hotel: <b>{order.hotelId || "N/A"}</b>
          </span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <span>⏰</span>
          <span className="text-gray-700">
            {order.timestamp
              ? new Date(order.timestamp).toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-white/70 border border-green-100 p-3">
        <div className="flex items-center gap-2 mb-2 text-green-700 font-medium">
          <span>🍱 Items</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100">
            {order.cartItems?.length || 0}
          </span>
        </div>
        <ul className="list-disc ml-5 text-sm text-gray-700">
          {(order.cartItems || []).map((item, idx) => (
            <li key={idx}>
              {item.name} × {item.quantity === 1 ? (item.qty) : item.qty + ' x ' + item.quantity} (₹{item.price})
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-extrabold text-emerald-600">
          ₹{total}
        </div>
        {order.status === "pending" ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onPrint(order)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 text-white shadow hover:shadow-blue-300/60 active:scale-[0.98] transition-all text-sm"
            >
              <span>🖨️</span> Print Bill
            </button>
          
          </div>
        ) : (
          <span className="text-emerald-600/80 text-sm">Completed ✅</span>
        )}
      </div>
    </AnimatedWrap>
  );
};

const CuteRow = ({ children, animationMode }) => (
  <AnimatedWrap
    as="tr"
    mode={animationMode}
    className="rounded-xl hover:bg-green-50"
  >
    {children}
  </AnimatedWrap>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const [viewMode, setViewMode] = useState("cards"); 
  const [animationMode, setAnimationMode] = useState("soft");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    fetchOrders();
  }, [dateFilter, selectedDate]);

  const fetchOrders = () => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;

    if (!user || !user.hotelId) {
      console.error("User data or hotelId not found");
      return;
    }

    const params = new URLSearchParams({ hotelId: user.hotelId });

    if (dateFilter !== "all") {
      params.append("period", dateFilter);
      if (dateFilter === "custom" && selectedDate) {
        params.append("date", selectedDate);
      }
    }

    Axios.get(`${API_URL}/admin/orders?${params.toString()}`)
      .then((res) => {
        if (res.data?.success) setOrders(res.data.orders || []);
      })
      .catch((err) => console.error("Failed to fetch orders", err));
  };

  const calculateTotal = (items) =>
    (items || []).reduce((total, item) => total + item.qty * item.price, 0);

  const printThermalBill = (order) => {
    const subtotal = calculateTotal(order.cartItems || []);
    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    const billContent = `
==============================
      FLAVOROFOODS
==============================
  Rajkot - 360004
  Phone: 9157433685
------------------------------
Order ID: ${order.orderId}
Table: ${order.tableNumber || "N/A"}
Date: ${order.timestamp ? new Date(order.timestamp).toLocaleDateString() : "N/A"}
Time: ${order.timestamp ? new Date(order.timestamp).toLocaleTimeString() : "N/A"}
------------------------------
ITEMS:
${(order.cartItems || []).map(item => 
  `${item.name.padEnd(20).substring(0,20)} ${item.quantity === 1 ? item.qty : `${item.qty} x ${item.quantity}`}  ₹${item.price * item.qty}`
).join('\n')}
------------------------------
Subtotal:       ₹${subtotal.toFixed(2)}
GST (5%):       ₹${gst.toFixed(2)}
------------------------------
TOTAL:          ₹${total.toFixed(2)}
==============================
Thank you for dining with us!
      Visit Again!
==============================
    `.trim();
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill ${order.orderId}</title>
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
            
            .bill-container {
              text-align: center;
            }
            
            .header {
              margin-bottom: 20px;
            }
            
            .restaurant-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
              letter-spacing: 1px;
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
            
            .item-name {
              text-align: left;
            }
            
            .item-qty {
              text-align: center;
            }
            
            .item-price {
              text-align: right;
            }
            
            .totals {
              margin-top: 20px;
            }
            
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
            }
            
            .footer {
              margin-top: 30px;
              font-style: italic;
            }
            
            @media print {
              body { 
                margin: 0; 
                padding: 10px;
                font-size: 13px;
              }
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
          <div class="bill-container">
            <div class="header">
              <div class="restaurant-name">FLAVOROFOODS</div>
              <div>Rajkot - 360004</div>
              <div>Phone: 9157433685</div>
            </div>
            
            <div class="divider"></div>
            
            <div style="text-align: left; margin-bottom: 10px;">
              <div>Order ID: ${order.orderId}</div>
              <div>Table: ${order.tableNumber || "N/A"}</div>
              <div>Date: ${order.timestamp ? new Date(order.timestamp).toLocaleDateString() : "N/A"}</div>
              <div>Time: ${order.timestamp ? new Date(order.timestamp).toLocaleTimeString() : "N/A"}</div>
            </div>
            
            <div class="divider"></div>
            
            <table class="items-table">
              <tbody>
                ${(order.cartItems || []).map(item => `
                  <tr>
                    <td class="item-name">${item.name}</td>
                    <td class="item-qty">${item.quantity === 1 ? item.qty : `${item.qty} x ${item.quantity}`}</td>
                    <td class="item-price">₹${item.price * item.qty}</td>
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
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  

  const handlePrint = async (order) => {
    printThermalBill(order);
    
    try {
      await Axios.put(`${API_URL}/orders/${order._id}/complete`);
      console.log(`Order completed and table ${order.tableNumber} set to available`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pending"),
    [orders]
  );
  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "completed"),
    [orders]
  );

  const renderTable = (list, isPending) => (
    <div
      className={`overflow-x-auto mt-4 transition-all duration-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <table className="table-auto w-full border border-green-200 rounded-2xl overflow-hidden bg-white">
        <thead>
          <tr className="bg-green-100/70 text-green-800">
            <th className="px-4 py-3 border border-green-200 text-left">🧾 Order</th>
            <th className="px-4 py-3 border border-green-200 text-left">🍽️ Table</th>
            <th className="px-4 py-3 border border-green-200 text-left">🏨 Hotel</th>
            <th className="px-4 py-3 border border-green-200 text-left">⏰ Date</th>
            <th className="px-4 py-3 border border-green-200 text-left">🍱 Items</th>
            <th className="px-4 py-3 border border-green-200 text-left">💰 Total</th>
            <th className="px-4 py-3 border border-green-200 text-left">📌 Status</th>
            {isPending && (
              <th className="px-4 py-3 border border-green-200 text-left">✨ Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {list.map((order) => (
            <CuteRow key={order._id} animationMode={animationMode}>
              <td className="px-4 py-3 border border-green-100">{order.orderId}</td>
              <td className="px-4 py-3 border border-green-100">
                {order.tableNumber || "N/A"}
              </td>
              <td className="px-4 py-3 border border-green-100">
                {order.hotelId || "N/A"}
              </td>
              <td className="px-4 py-3 border border-green-100">
                {order.timestamp
                  ? new Date(order.timestamp).toLocaleString()
                  : "N/A"}
              </td>
              <td className="px-4 py-3 border border-green-100">
                <ul className="list-disc ml-5">
                  {(order.cartItems || []).map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity === 1 ? (item.qty) : item.qty + ' x ' + item.quantity} (₹{item.price})
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-3 border border-green-100 font-bold text-emerald-600">
                ₹{calculateTotal(order.cartItems || [])}
              </td>
              <td className="px-4 py-3 border border-green-100">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              {isPending && (
                <td className="px-4 py-3 border border-green-100">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handlePrint(order)}
                      className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs hover:shadow-blue-300/60 active:scale-[0.98] transition-all"
                    >
                      🖨️ Print
                    </button>
                   
                  </div>
                </td>
              )}
            </CuteRow>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCards = (list, isPending) => (
    <div
      className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-4 transition-all duration-500 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      {list.map((order) => (
        <CuteOrderCard
          key={order._id}
          order={order}
          total={calculateTotal(order.cartItems || [])}
          onPrint={handlePrint}
          animationMode={animationMode}
        />
      ))}
      {list.length === 0 && (
        <div className="col-span-full text-center text-gray-500">
          No {isPending ? "pending" : "completed"} orders for selected date
        </div>
      )}
    </div>
  );

  const listForTab = activeTab === "pending" ? pendingOrders : completedOrders;

  return (
    <>
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="relative min-h-screen">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,228,230,0.6),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(237,233,254,0.6),transparent_45%)]" />
        <div className="relative p-5 mt-16 lg:mt-0">
          <div
            className={`transition-all duration-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-green-700 drop-shadow-sm">
               Orders — Dashboard
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="rounded-full bg-white/80 backdrop-blur border border-green-200 p-1 shadow-sm flex">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    viewMode === "cards"
                      ? "bg-green-500 text-white shadow"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                >
                   Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    viewMode === "table"
                      ? "bg-green-500 text-white shadow"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                >
                  📋 Table
                </button>
              </div>

              <div className="rounded-full bg-white/80 backdrop-blur border border-violet-200 p-1 shadow-sm flex">
                <span className="px-3 py-2 text-sm text-violet-700">✨ Animation</span>
                <button
                  onClick={() => setAnimationMode("soft")}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    animationMode === "soft"
                      ? "bg-violet-500 text-white shadow"
                      : "text-violet-700 hover:bg-violet-50"
                  }`}
                >
                  Soft
                </button>
                <button
                  onClick={() => setAnimationMode("tilt")}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    animationMode === "tilt"
                      ? "bg-violet-500 text-white shadow"
                      : "text-violet-700 hover:bg-violet-50"
                  }`}
                >
                  3D Tilt
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-white/80 backdrop-blur border border-green-200 shadow-sm">
              <div className="flex flex-wrap gap-4 items-center">
                <label className="font-medium text-green-700">🎯 Filter by Date:</label>

                <div className="flex items-center gap-2">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 rounded-full border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white text-green-800"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                    <option value="custom">Custom Date</option>
                  </select>

                  <CalendarDays className="text-green-500 w-5 h-5" />
                </div>

                {dateFilter === "custom" && (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 rounded-full border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white text-green-800"
                  />
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="inline-flex p-1 rounded-full bg-white/80 backdrop-blur border border-green-200 shadow-sm">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === "pending"
                      ? "bg-green-500 text-white shadow"
                      : "text-green-700 hover:bg-green-50"
                  }`}
                >
                  🍥 Pending ({pendingOrders.length})
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === "completed"
                      ? "bg-violet-500 text-white shadow"
                      : "text-violet-700 hover:bg-violet-50"
                  }`}
                >
                  🍡 Completed ({completedOrders.length})
                </button>
              </div>
            </div>

            {viewMode === "cards"
              ? activeTab === "pending"
                ? renderCards(pendingOrders, true)
                : renderCards(completedOrders, false)
              : activeTab === "pending"
              ? pendingOrders.length > 0
                ? renderTable(pendingOrders, true)
                : (
                  <p className="mt-4 text-gray-500">
                    No pending orders for selected date
                  </p>
                )
              : completedOrders.length > 0
              ? renderTable(completedOrders, false)
              : (
                <p className="mt-4 text-gray-500">
                  No completed orders for selected date
                </p>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;