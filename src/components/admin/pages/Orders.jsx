import React, { useEffect, useMemo, useState } from "react";
import Axios from "axios";
import jsPDF from "jspdf";
import {
  CalendarDays,
  Home,
  Users,
  ShoppingCart,
  Package,
  Table,
  Menu,
  X as CloseIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { API_URL } from "../../../helper";

const SPRING_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Table, label: "Tables", path: "/admin/tables" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      <div className="lg:hidden bg-white border-b p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-orange-600">Flavaro Admin</h2>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg border border-gray-200"
        >
          {isMobileOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r p-4 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:w-64 w-64
      `}
      >
        <h2 className="text-2xl font-bold text-orange-600 mb-8 px-4 hidden lg:block">
          Flavaro Admin
        </h2>

        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg border border-gray-200"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? "bg-orange-50 text-orange-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

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
      style={{
        ...(mode === "tilt" ? style : {}),
        ["--spring-ease"]: SPRING_EASE,
      }}
      className={`${base} ${mode === "soft" ? soft : tilt} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

const CuteOrderCard = ({ order, onPrint, total, animationMode }) => {
  return (
    <AnimatedWrap
      mode={animationMode}
      className="rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 via-white to-orange-50/50 p-4 shadow-sm hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧾</span>
          <div className="font-semibold text-orange-700">
            Order #{order.orderId}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-orange-100 text-orange-700"
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
        <div className="flex items-center gap-2 col-span-2">
          <span>⏰</span>
          <span className="text-gray-700">
            {order.timestamp
              ? new Date(order.timestamp).toLocaleString()
              : "N/A"}
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-white/70 border border-orange-100 p-3">
        <div className="flex items-center gap-2 mb-2 text-orange-700 font-medium">
          <span>🍱 Items</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100">
            {order.cartItems?.length || 0}
          </span>
        </div>
        <ul className="list-disc ml-5 text-sm text-gray-700">
          {(order.cartItems || []).map((item, idx) => (
            <li key={idx}>
              {item.name} ×{" "}
              {item.quantity === 1
                ? item.qty
                : item.qty + " x " + item.quantity}{" "}
              (₹{item.price})
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-extrabold text-orange-600">₹{total}</div>
        {order.status === "pending" ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onPrint(order)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 text-white shadow hover:shadow-orange-300/60 active:scale-[0.98] transition-all text-sm"
            >
              <span>🖨️</span> Print Bill
            </button>
          </div>
        ) : (
          <span className="text-orange-600/80 text-sm">Completed ✅</span>
        )}
      </div>
    </AnimatedWrap>
  );
};

const CuteRow = ({ children, animationMode }) => (
  <AnimatedWrap
    as="tr"
    mode={animationMode}
    className="rounded-xl hover:bg-orange-50"
  >
    {children}
  </AnimatedWrap>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [viewMode, setViewMode] = useState("cards");
  const [animationMode, setAnimationMode] = useState("soft");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dropdownRef = React.useRef(null);

  // useEffect(() => {
  //   fetchOrders();
  // }, [dateFilter, selectedDate]); 

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {

    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 1000); // 10 s


    return () => {
      clearInterval(intervalId);
    };
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
      if (dateFilter === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];
        params.append("date", yesterdayStr);
        params.append("period", "custom");
      } else {
        params.append("period", dateFilter);
        if (dateFilter === "custom" && selectedDate) {
          params.append("date", selectedDate);
        }
      }
    }

    Axios.get(`${API_URL}/admin/orders?${params.toString()}`)
      .then((res) => {
        if (res.data?.success) setOrders(res.data.orders || []);
      })
      .catch((err) => console.error("Failed to fetch orders", err));
  };

  const getDateDisplayText = () => {
    const today = new Date();
    switch (dateFilter) {
      case "today":
        return `Showing orders for: Today (${today.toLocaleDateString()})`;
      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return `Showing orders for: Yesterday (${yesterday.toLocaleDateString()})`;
      case "month":
        return `Showing orders for: This month (${today.toLocaleDateString(
          "default",
          { month: "long", year: "numeric" }
        )})`;
      case "custom":
        if (selectedDate) {
          const customDate = new Date(selectedDate);
          return `Showing orders for: ${customDate.toLocaleDateString()}`;
        }
        return "Showing orders for: Custom date";
      default:
        return "Showing all orders";
    }
  };

  const filterOrdersByDate = (ordersList) => {
    if (dateFilter === "all") return ordersList;
    const now = new Date();
    return ordersList.filter((order) => {
      if (!order.timestamp) return false;
      const orderDate = new Date(order.timestamp);
      switch (dateFilter) {
        case "today":
          return orderDate.toDateString() === now.toDateString();
        case "yesterday":
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          return orderDate.toDateString() === yesterday.toDateString();
        case "month":
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        case "custom":
          if (!selectedDate) return true;
          const selected = new Date(selectedDate);
          return orderDate.toDateString() === selected.toDateString();
        default:
          return true;
      }
    });
  };

  const calculateTotal = (items) =>
    (items || []).reduce((total, item) => total + item.qty * item.price, 0);

  const printThermalBill = (order) => {
    const subtotal = calculateTotal(order.cartItems || []);
    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    const printWindow = window.open("", "_blank");
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
            .bill-container { text-align: center; }
            .header { margin-bottom: 20px; }
            .restaurant-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; letter-spacing: 1px; }
            .divider { border-top: 2px dashed #000; margin: 15px 0; }
            .items-table { width: 100%; margin: 15px 0; border-collapse: collapse; }
            .items-table td { padding: 4px 0; border-bottom: 1px dashed #ddd; }
            .item-name { text-align: left; }
            .item-qty { text-align: center; }
            .item-price { text-align: right; }
            .totals { margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #000; }
            .grand-total { font-size: 16px; font-weight: bold; margin-top: 10px; }
            .footer { margin-top: 30px; font-style: italic; }
            @media print {
              body { margin: 0; padding: 10px; font-size: 13px; }
            }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 500);">
          <div class="bill-container">
            <div class="header">
              <div class="restaurant-name">FLAVOROFOODS</div>
              <div>Rajkot - 360004</div>
              <div>Phone: ${JSON.parse(localStorage.getItem("user"))?.mobile || "N/A"}</div>
            </div>
            <div class="divider"></div>
            <div style="text-align: left; margin-bottom: 10px;">
              <div>Order ID: ${order.orderId}</div>
              <div>Table: ${order.tableNumber || "N/A"}</div>
              <div>Date: ${order.timestamp
        ? new Date(order.timestamp).toLocaleDateString()
        : "N/A"
      }</div>
              <div>Time: ${order.timestamp
        ? new Date(order.timestamp).toLocaleTimeString()
        : "N/A"
      }</div>
            </div>
            <div class="divider"></div>
            <table class="items-table">
              <tbody>
                ${(order.cartItems || [])
        .map(
          (item) => `
                  <tr>
                    <td class="item-name">${item.name}</td>
                    <td class="item-qty">${item.quantity === 1
              ? item.qty
              : `${item.qty} x ${item.quantity}`
            }</td>
                    <td class="item-price">₹${item.price * item.qty}</td>
                  </tr>
                `
        )
        .join("")}
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
      console.log(
        `Order completed and table ${order.tableNumber} set to available`
      );
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  const filteredOrders = useMemo(() => {
    return filterOrdersByDate(orders);
  }, [orders, dateFilter, selectedDate]);

  const pendingOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === "pending"),
    [filteredOrders]
  );
  const completedOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === "completed"),
    [filteredOrders]
  );

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
    if (value !== "custom") {
      setSelectedDate("");
    }
    setIsDropdownOpen(false);
  };

  const getCurrentPageOrders = (ordersList) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return ordersList.slice(startIndex, endIndex);
  };

  const totalPages = (ordersList) => {
    return Math.ceil(ordersList.length / itemsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const renderTable = (list, isPending) => {
    const currentPageOrders = getCurrentPageOrders(list);
    const totalPageCount = totalPages(list);

    return (
      <>
        <div
          className={`overflow-x-auto mt-4 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
          <table className="table-auto w-full border border-orange-200 rounded-2xl overflow-hidden bg-white">
            <thead>
              <tr className="bg-orange-100/70 text-orange-800">
                <th className="px-4 py-3 border border-orange-200 text-left">
                  🧾 Order
                </th>
                <th className="px-4 py-3 border border-orange-200 text-left">
                  🍽️ Table
                </th>
                <th className="px-4 py-3 border border-orange-200 text-left">
                  ⏰ Date
                </th>
                <th className="px-4 py-3 border border-orange-200 text-left">
                  🍱 Items
                </th>
                <th className="px-4 py-3 border border-orange-200 text-left">
                  💰 Total
                </th>
                <th className="px-4 py-3 border border-orange-200 text-left">
                  📌 Status
                </th>
                {isPending && (
                  <th className="px-4 py-3 border border-orange-200 text-left">
                    ✨ Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentPageOrders.map((order) => (
                <CuteRow key={order._id} animationMode={animationMode}>
                  <td className="px-4 py-3 border border-orange-100">
                    {order.orderId}
                  </td>
                  <td className="px-4 py-3 border border-orange-100">
                    {order.tableNumber || "N/A"}
                  </td>
                  <td className="px-4 py-3 border border-orange-100">
                    {order.timestamp
                      ? new Date(order.timestamp).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 border border-orange-100">
                    <ul className="list-disc ml-5">
                      {(order.cartItems || []).map((item, idx) => (
                        <li key={idx}>
                          {item.name} ×{" "}
                          {item.quantity === 1
                            ? item.qty
                            : item.qty + " x " + item.quantity}{" "}
                          (₹{item.price})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 border border-orange-100 font-bold text-orange-600">
                    ₹{calculateTotal(order.cartItems || [])}
                  </td>
                  <td className="px-4 py-3 border border-orange-100">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-orange-100 text-orange-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  {isPending && (
                    <td className="px-4 py-3 border border-orange-100">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handlePrint(order)}
                          className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs hover:shadow-orange-300/60 active:scale-[0.98] transition-all"
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

        {list.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 p-3 bg-white/80 backdrop-blur border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <span className="text-sm text-gray-600">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-1 border border-orange-200 rounded-lg bg-white text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, list.length)} of{" "}
                {list.length} orders
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-orange-200 text-orange-600 hover:bg-orange-50"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPageCount) }, (_, i) => {
                  let pageNum;
                  if (totalPageCount <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPageCount - 2) {
                    pageNum = totalPageCount - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum > 0 && pageNum <= totalPageCount) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm ${currentPage === pageNum
                            ? "bg-orange-500 text-white font-medium"
                            : "text-gray-600 hover:bg-orange-50"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPageCount}
                className={`p-2 rounded-lg border ${currentPage === totalPageCount
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-orange-200 text-orange-600 hover:bg-orange-50"
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderCards = (list, isPending) => {
    const currentPageOrders = getCurrentPageOrders(list);
    const totalPageCount = totalPages(list);

    return (
      <>
        <div
          className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-4 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
        >
          {currentPageOrders.map((order) => (
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

        {list.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 p-3 bg-white/80 backdrop-blur border border-orange-200 rounded-xl">
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <span className="text-sm text-gray-600">Items per page:</span>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-3 py-1 border border-orange-200 rounded-lg bg-white text-sm"
              >
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, list.length)} of{" "}
                {list.length} orders
              </span>
            </div>

            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${currentPage === 1
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-orange-200 text-orange-600 hover:bg-orange-50"
                  }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPageCount) }, (_, i) => {
                  let pageNum;
                  if (totalPageCount <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPageCount - 2) {
                    pageNum = totalPageCount - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  if (pageNum > 0 && pageNum <= totalPageCount) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm ${currentPage === pageNum
                            ? "bg-orange-500 text-white font-medium"
                            : "text-gray-600 hover:bg-orange-50"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPageCount}
                className={`p-2 rounded-lg border ${currentPage === totalPageCount
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-orange-200 text-orange-600 hover:bg-orange-50"
                  }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  const listForTab = activeTab === "pending" ? pendingOrders : completedOrders;

  return (
    <>
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="lg:flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1 relative min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(254,242,242,0.6),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(254,215,170,0.6),transparent_45%)]" />
          <div className="relative p-5 mt-16 lg:mt-0">
            <div
              className={`transition-all duration-700 ${mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2"
                }`}
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-black drop-shadow-sm">
                Orders — Dashboard
              </h1>

              <div className="mt-2">
                <p className="text-orange-600 font-medium">
                  {getDateDisplayText()}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="rounded-full bg-white/80 backdrop-blur border border-orange-200 p-1 shadow-sm flex">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${viewMode === "cards"
                        ? "bg-orange-500 text-white shadow"
                        : "text-orange-600 hover:bg-orange-50"
                      }`}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${viewMode === "table"
                        ? "bg-orange-500 text-white shadow"
                        : "text-orange-600 hover:bg-orange-50"
                      }`}
                  >
                    📋 Table
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-white/80 backdrop-blur border border-orange-200 shadow-sm">
                <div className="flex flex-wrap gap-4 items-center">
                  <label className="font-medium text-black">
                    🎯 Filter by Date:
                  </label>

                  <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:border-orange-300 min-w-[160px] justify-between"
                    >
                      <span className="text-black truncate">
                        {dateFilter === "all" && "All Dates"}
                        {dateFilter === "today" && "Today"}
                        {dateFilter === "yesterday" && "Yesterday"}
                        {dateFilter === "month" && "This Month"}
                        {dateFilter === "custom" && "Custom Date"}
                      </span>
                      <ChevronDown
                        className={`text-orange-500 w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 z-50 ">
                        <div className="rounded-xl border border-orange-200 bg-white shadow-lg overflow-hidden">
                          <div className="py-1">
                            <button
                              onClick={() => handleDateFilterChange("all")}
                              className={`w-full text-left px-4 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${dateFilter === "all"
                                  ? "bg-orange-50 text-orange-600 font-medium"
                                  : "text-black"
                                }`}
                            >
                              All Dates
                            </button>
                            <button
                              onClick={() => handleDateFilterChange("today")}
                              className={`w-full text-left px-4 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${dateFilter === "today"
                                  ? "bg-orange-50 text-orange-600 font-medium"
                                  : "text-black"
                                }`}
                            >
                              Today
                            </button>
                            <button
                              onClick={() =>
                                handleDateFilterChange("yesterday")
                              }
                              className={`w-full text-left px-4 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${dateFilter === "yesterday"
                                  ? "bg-orange-50 text-orange-600 font-medium"
                                  : "text-black"
                                }`}
                            >
                              Yesterday
                            </button>
                            <button
                              onClick={() => handleDateFilterChange("month")}
                              className={`w-full text-left px-4 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${dateFilter === "month"
                                  ? "bg-orange-50 text-orange-600 font-medium"
                                  : "text-black"
                                }`}
                            >
                              This Month
                            </button>
                            <button
                              onClick={() => handleDateFilterChange("custom")}
                              className={`w-full text-left px-4 py-2 hover:bg-orange-50 cursor-pointer transition-colors ${dateFilter === "custom"
                                  ? "bg-orange-50 text-orange-600 font-medium"
                                  : "text-black"
                                }`}
                            >
                              Custom Date
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <CalendarDays className="text-black w-5 h-5 flex-shrink-0" />

                  {dateFilter === "custom" && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-none outline-none text-orange-800 w-full"
                      />
                      <CalendarDays className="text-orange-500 w-4 h-4 flex-shrink-0" />
                    </div>
                  )}
                </div>
                <div
                  className={`mt-4 transition-all duration-300 -z-1 ${isDropdownOpen ? "" : ""
                    }`}
                >
                  <div className="inline-flex p-1 rounded-full bg-white/80 backdrop-blur border border-orange-200 shadow-sm">
                    <button
                      onClick={() => setActiveTab("pending")}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === "pending"
                          ? "bg-orange-500 text-white shadow"
                          : "text-orange-600 hover:bg-orange-50"
                        }`}
                    >
                      🍥 Pending ({pendingOrders.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("completed")}
                      className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === "completed"
                          ? "bg-orange-500 text-white shadow"
                          : "text-orange-600 hover:bg-orange-50"
                        }`}
                    >
                      🍡 Completed ({completedOrders.length})
                    </button>
                  </div>
                </div>
                <div
                  className={`transition-all duration-300 ${isDropdownOpen ? "mt-8" : "mt-4"
                    }`}
                >
                  {viewMode === "cards" ? (
                    activeTab === "pending" ? (
                      renderCards(pendingOrders, true)
                    ) : (
                      renderCards(completedOrders, false)
                    )
                  ) : activeTab === "pending" ? (
                    pendingOrders.length > 0 ? (
                      renderTable(pendingOrders, true)
                    ) : (
                      <p className="mt-4 text-gray-500">
                        No pending orders for selected date
                      </p>
                    )
                  ) : completedOrders.length > 0 ? (
                    renderTable(completedOrders, false)
                  ) : (
                    <p className="mt-4 text-gray-500">
                      No completed orders for selected date
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;