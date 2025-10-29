import React, { useState } from "react";
import { Home, Users, Settings, Package, ShoppingCart, BarChart2, Menu, X, Table } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

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
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-orange-600">Flavaro Admin</h2>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg border border-gray-200"
        >
          {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen bg-white border-r p-4 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-64 w-64
      `}>
        {/* Desktop Title - Hidden on mobile */}
        <h2 className="text-2xl font-bold text-orange-600 mb-8 px-4 hidden lg:block">
          Flavaro Admin
        </h2>
        
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg border border-gray-200"
          >
            <X size={20} />
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
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

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;