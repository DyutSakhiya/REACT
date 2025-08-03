import React from "react";
import { ArrowUp, ArrowDown, TrendingUp, Users as UsersIcon, ShoppingCart, DollarSign } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹12,345",
      change: "+12%",
      isPositive: true,
      icon: <DollarSign size={24} className="text-green-500" />,
    },
    {
      title: "Total Orders",
      value: "1,234",
      change: "+8%",
      isPositive: true,
      icon: <ShoppingCart size={24} className="text-blue-500" />,
    },
    {
      title: "New Customers",
      value: "567",
      change: "-3%",
      isPositive: false,
      icon: <UsersIcon size={24} className="text-purple-500" />,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+1.2%",
      isPositive: true,
      icon: <TrendingUp size={24} className="text-orange-500" />,
    },
  ];

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