import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, TrendingUp, Users as UsersIcon, ShoppingCart, IndianRupee, Calendar } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Axios from "axios";

const API_URL = "https://backend-inky-gamma-67.vercel.app/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState("today");
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

  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState({
    current: { orders: 0, revenue: 0 },
    previous: { orders: 0, revenue: 0 },
    percentageChange: { orders: 0, revenue: 0 }
  });

  useEffect(() => {
    if (user && user.hotelId) {
      fetchDashboardData();
    }
  }, [user, timePeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [orderStats, revenueStats] = await Promise.all([
        Axios.get(`${API_URL}/admin/order-stats?hotelId=${user.hotelId}&period=${timePeriod}`),
        Axios.get(`${API_URL}/admin/revenue-stats?hotelId=${user.hotelId}&period=${timePeriod}`),
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
          }
        });

        // Calculate average order value
        const avgOrderValue = orderData.currentPeriod > 0 ? revenueData.currentPeriod / orderData.currentPeriod : 0;
        const previousAvgOrderValue = orderData.previousPeriod > 0 ? revenueData.previousPeriod / orderData.previousPeriod : 0;
        const avgOrderValueChange = previousAvgOrderValue > 0 ? ((avgOrderValue - previousAvgOrderValue) / previousAvgOrderValue) * 100 : 0;

        const newStats = [
          {
            title: "Total Revenue",
            value: `₹${revenueData.currentPeriod.toLocaleString()}`,
            change: `${revenueData.percentageChange >= 0 ? '+' : ''}${revenueData.percentageChange.toFixed(1)}%`,
            isPositive: revenueData.percentageChange >= 0,
            icon: <IndianRupee size={24} className="text-green-500" />,
          },
          {
            title: "Total Orders",
            value: orderData.currentPeriod.toString(),
            change: `${orderData.percentageChange >= 0 ? '+' : ''}${orderData.percentageChange.toFixed(1)}%`,
            isPositive: orderData.percentageChange >= 0,
            icon: <ShoppingCart size={24} className="text-blue-500" />,
          },
          {
            title: "Average Order Value",
            value: `₹${avgOrderValue.toFixed(0)}`,
            change: `${avgOrderValueChange >= 0 ? '+' : ''}${avgOrderValueChange.toFixed(1)}%`,
            isPositive: avgOrderValueChange >= 0,
            icon: <TrendingUp size={24} className="text-orange-500" />,
          },
        ];
        
        setStats(newStats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = () => {
    const labels = {
      today: "Today",
      yesterday: "Yesterday",
      week: "This Week",
      month: "This Month",
      year: "This Year",
      "5years": "Last 5 Years"
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
      "5years": "Previous 5 Years"
    };
    return labels[timePeriod] || "Yesterday";
  };

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-0">
      {/* Time Period Selector */}
      <div className="bg-white p-3 md:p-4 rounded-xl shadow border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-600" />
            <h2 className="text-base md:text-lg font-semibold">Time Period</h2>
          </div>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="5years">Last 5 Years</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-100 text-center">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm md:text-base text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {/* Main Stats Grid - Responsive for mobile */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 ml-2">
                  {React.cloneElement(stat.icon, { size: window.innerWidth < 768 ? 20 : 24 })}
                </div>
              </div>
              <div className={`mt-3 md:mt-4 flex items-center text-xs md:text-sm ${
                stat.isPositive ? "text-green-500" : "text-red-500"
              }`}>
                {stat.isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span className="ml-1">{stat.change}</span>
                <span className="ml-1 text-gray-500 hidden xs:inline">vs {getPreviousPeriodLabel().toLowerCase()}</span>
              </div>
              <div className="mt-1 xs:hidden text-xs text-gray-500">
                vs {getPreviousPeriodLabel().toLowerCase()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-center py-6 md:py-8 text-gray-500">
          <p className="text-sm md:text-base">Hotel {user?.hotelId || "hotel_001"} - No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;