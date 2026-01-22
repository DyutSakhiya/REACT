import React, { useState, useEffect } from "react";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Users as UsersIcon,
  ShoppingCart,
  IndianRupee,
  Calendar,
  Table,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../helper";

const Dashboard = () => {
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const [timePeriod, setTimePeriod] = useState("today");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [stats, setStats] = useState([
    {
      title: "Total Revenue",
      value: "₹0",
      change: "+0%",
      isPositive: true,
      icon: <IndianRupee size={24} className="text-green-500" />,
    },
    {
      title: "Total Orders",
      value: "0",
      change: "+0%",
      isPositive: true,
      icon: <ShoppingCart size={24} className="text-blue-500" />,
    },
    {
      title: "Average Order Value",
      value: "₹0",
      change: "+0%",
      isPositive: true,
      icon: <TrendingUp size={24} className="text-orange-500" />,
    },
  ]);

  const [tableStats, setTableStats] = useState({
    available: 0,
    occupied: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState({
    current: { orders: 0, revenue: 0 },
    previous: { orders: 0, revenue: 0 },
    percentageChange: { orders: 0, revenue: 0 },
  });

  const getAuthAxios = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return Axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    console.log("Dashboard mounted. User:", user); 
    
    if (user && user.hotelId) {
      console.log("Fetching data for hotelId:", user.hotelId);
      fetchDashboardData();
      fetchTableStats();
    } else {
      console.warn("User or hotelId is missing. User:", user);
      
      navigate('/login');
    }
  }, [user, timePeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const authAxios = getAuthAxios();
      
      const [orderStats, revenueStats] = await Promise.all([
        authAxios.get(
          `${API_URL}/admin/order-stats?hotelId=${user.hotelId}&period=${timePeriod}`
        ),
        authAxios.get(
          `${API_URL}/admin/revenue-stats?hotelId=${user.hotelId}&period=${timePeriod}`
        ),
      ]);

      if (orderStats.data.success && revenueStats.data.success) {
        const orderData = orderStats.data;
        const revenueData = revenueStats.data;

        setComparisonData({
          current: {
            orders: orderData.currentPeriod,
            revenue: revenueData.currentPeriod,
          },
          previous: {
            orders: orderData.previousPeriod,
            revenue: revenueData.previousPeriod,
          },
          percentageChange: {
            orders: orderData.percentageChange,
            revenue: revenueData.percentageChange,
          },
        });

        const avgOrderValue =
          orderData.currentPeriod > 0
            ? revenueData.currentPeriod / orderData.currentPeriod
            : 0;
        const previousAvgOrderValue =
          orderData.previousPeriod > 0
            ? revenueData.previousPeriod / orderData.previousPeriod
            : 0;
        const avgOrderValueChange =
          previousAvgOrderValue > 0
            ? ((avgOrderValue - previousAvgOrderValue) /
              previousAvgOrderValue) *
            100
            : 0;

        const newStats = [
          {
            title: "Total Revenue",
            value: `₹${revenueData.currentPeriod.toLocaleString()}`,
            change: `${
              revenueData.percentageChange >= 0 ? "+" : ""
            }${revenueData.percentageChange.toFixed(1)}%`,
            isPositive: revenueData.percentageChange >= 0,
            icon: <IndianRupee size={24} className="text-green-500" />,
          },
          {
            title: "Total Orders",
            value: orderData.currentPeriod.toString(),
            change: `${
              orderData.percentageChange >= 0 ? "+" : ""
            }${orderData.percentageChange.toFixed(1)}%`,
            isPositive: orderData.percentageChange >= 0,
            icon: <ShoppingCart size={24} className="text-blue-500" />,
          },
          {
            title: "Average Order Value",
            value: `₹${avgOrderValue.toFixed(0)}`,
            change: `${
              avgOrderValueChange >= 0 ? "+" : ""
            }${avgOrderValueChange.toFixed(1)}%`,
            isPositive: avgOrderValueChange >= 0,
            icon: <TrendingUp size={24} className="text-orange-500" />,
          },
        ];

        setStats(newStats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      
      if (error.response && error.response.status === 401) {
        console.error("Authentication failed. Token may be expired or invalid.");
        
        alert("Your session has expired. Please login again.");
        
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        
        if (logout) {
          logout();
        }
        
        navigate("/login");
      } else if (error.response) {
        
        console.error(`API Error ${error.response.status}:`, error.response.data);
      } else if (error.request) {
       
        console.error("Network error. Please check your connection.");
      }
      
      if (process.env.NODE_ENV === "development") {
        showMockData();
      }
    } finally {
      setLoading(false);
    }
  };

  const showMockData = () => {
    console.log("Showing mock data for development");
    
    const mockStats = [
      {
        title: "Total Revenue",
        value: "₹12,500",
        change: "+11.6%",
        isPositive: true,
        icon: <IndianRupee size={24} className="text-green-500" />,
      },
      {
        title: "Total Orders",
        value: "42",
        change: "+10.5%",
        isPositive: true,
        icon: <ShoppingCart size={24} className="text-blue-500" />,
      },
      {
        title: "Average Order Value",
        value: "₹298",
        change: "+8.2%",
        isPositive: true,
        icon: <TrendingUp size={24} className="text-orange-500" />,
      },
    ];
    
    setStats(mockStats);
    setComparisonData({
      current: { orders: 42, revenue: 12500 },
      previous: { orders: 38, revenue: 11200 },
      percentageChange: { orders: 10.5, revenue: 11.6 },
    });
  };

  const fetchTableStats = async () => {
    try {
      const mockTables = Array.from({ length: 10 }, (_, i) => ({
        status: Math.random() > 0.5 ? "available" : "occupied",
      }));

      setTableStats({
        available: mockTables.filter((t) => t.status === "available").length,
        occupied: mockTables.filter((t) => t.status === "occupied").length,
        total: mockTables.length,
      });
    } catch (error) {
      console.error("Failed to fetch table stats:", error);
    }
  };

  const getPeriodLabel = () => {
    const labels = {
      today: "Today",
      yesterday: "Yesterday",
      week: "This Week",
      month: "This Month",
      year: "This Year",
    };
    return labels[timePeriod] || "Today";
  };

  const getPreviousPeriodLabel = () => {
    const labels = {
      today: "Yesterday",
      yesterday: "Day Before",
      week: "Last Week",
      month: "Last Month",
      year: "Last Year",
    };
    return labels[timePeriod] || "Yesterday";
  };

  const periodOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
  ];

  const handlePeriodSelect = (value) => {
    setTimePeriod(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4 lg:space-y-6 p-2 lg:p-0">
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold">Time Period</h2>
          </div>

          <div className="relative w-full sm:w-64">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 flex items-center justify-between border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium">{getPeriodLabel()}</span>
              <ChevronDown
                size={20}
                className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}
              />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10 sm:hidden"
                  onClick={() => setIsDropdownOpen(false)}
                />

                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="py-1">
                    {periodOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handlePeriodSelect(option.value)}
                        className={`
                          w-full px-4 py-3 text-left flex items-center justify-between
                          hover:bg-blue-50 transition-colors
                          ${timePeriod === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                        `}
                      >
                        <span className="font-medium">{option.label}</span>
                        {timePeriod === option.value && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {!loading && (!user || !user.hotelId) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
          <p className="text-yellow-700 mb-4">
            Please log in to view dashboard data. User or hotel information is missing.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      )}

      {!loading && user && user.hotelId && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 lg:p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-xl lg:text-2xl font-bold mt-1 truncate">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 ml-2 flex-shrink-0">
                    {stat.icon}
                  </div>
                </div>
                <div
                  className={`mt-3 flex items-center text-sm ${
                    stat.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                  <span className="ml-1">{stat.change}</span>
                  <span className="ml-1 text-gray-500 text-xs hidden sm:inline">
                    vs {getPreviousPeriodLabel().toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </>
      )}
    </div>
  );
};

export default Dashboard;