import React from "react";
import TableManagement from "./TableManagement";

const Tables = () => {
  return (
    <div className="space-y-6 p-2 lg:p-0">
      <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
          Table Management
        </h1>
        <p className="text-gray-600">
          Monitor and manage table occupancy in real-time. Click on any table to toggle its status.
        </p>
      </div>
      <TableManagement />
    </div>
  );
};

export default Tables;