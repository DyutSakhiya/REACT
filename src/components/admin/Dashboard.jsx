import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, TrendingUp, Users as UsersIcon, ShoppingCart, DollarSign } from "lucide-react";
import { useAuth } from "./context/AuthContext";

const API_URL = "http://localhost:4000/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    {
      title: "Total Revenue",
      value: "₹0",
      change: "+0%",
      isPositive: true,
      icon: <DollarSign size={24} className="text-green-500" />,
    },
    {
      title: "Total Orders",
      value: "0",
      change: "+0%",
      isPositive: true,
      icon: <ShoppingCart size={24} className="text-blue-500" />,
    },
    {
      title: "New Customers",
      value: "0",
      change: "-0%",
      isPositive: false,
      icon: <UsersIcon size={24} className="text-purple-500" />,
    },
    {
      title: "Conversion Rate",
      value: "0%",
      change: "+0%",
      isPositive: true,
      icon: <TrendingUp size={24} className="text-orange-500" />,
    },
  ]);

  useEffect(() => {
    if (user && user.hotelId) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
  
      const hotelIdNum = parseInt(user.hotelId.replace(/\D/g, '')) || 1;
      
      const newStats = [
        {
          title: "Total Revenue",
          value: `₹${(hotelIdNum * 12345).toLocaleString()}`,
          change: `${hotelIdNum * 2}%`,
          isPositive: true,
          icon: <DollarSign size={24} className="text-green-500" />,
        },
        {
          title: "Total Orders",
          value: `${(hotelIdNum * 1234).toLocaleString()}`,
          change: `${hotelIdNum * 1}%`,
          isPositive: true,
          icon: <ShoppingCart size={24} className="text-blue-500" />,
        },
        {
          title: "New Customers",
          value: `${(hotelIdNum * 567).toLocaleString()}`,
          change: `-${hotelIdNum * 0.5}%`,
          isPositive: false,
          icon: <UsersIcon size={24} className="text-purple-500" />,
        },
        {
          title: "Conversion Rate",
          value: `${(hotelIdNum * 0.8).toFixed(1)}%`,
          change: `+${hotelIdNum * 0.3}%`,
          isPositive: true,
          icon: <TrendingUp size={24} className="text-orange-500" />,
        },
      ];
      
      setStats(newStats);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow border border-gray-100 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50">{stat.icon}</div>
          </div>
          <div className={`mt-4 flex items-center text-sm ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
            {stat.isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            <span className="ml-1">{stat.change}</span>
            <span className="ml-1 text-gray-500">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;