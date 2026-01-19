
import React, { useState } from "react";
import { Home, Users, Settings, Package, ShoppingCart, BarChart2, Menu, X, Table, Building2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../admin/context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();

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

  const hotelName = user?.hotelname || user?.hotelName || "Flavaro Admin";
  
  // Get hotel logo from user data
  const hotelLogo = user?.hotelLogo;
  
  // Function to get logo URL
  const getLogoUrl = () => {
    if (hotelLogo && hotelLogo.data) {
      return `data:${hotelLogo.contentType};base64,${hotelLogo.data}`;
    }
    return null;
  };

  const logoUrl = getLogoUrl();

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Hotel Logo" 
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <Building2 className="text-orange-600" size={20} />
          )}
          <h2 className="text-lg font-bold text-orange-600 truncate max-w-[180px]">
            {hotelName}
          </h2>
        </div>
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
        <div className="mb-8 px-4 hidden lg:block">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Hotel Logo" 
                className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
              />
            ) : (
              <div className="p-2 bg-orange-100 rounded-lg">
                <Building2 className="text-orange-600" size={24} />
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {hotelName}
              </h2>
              <p className="text-xs text-gray-500">Hotel Admin Panel</p>
            </div>
          </div>
        </div>
        
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Hotel Logo" 
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <Building2 className="text-orange-600" size={20} />
            )}
            <h2 className="text-lg font-bold text-orange-600 truncate max-w-[180px]">
              {hotelName}
            </h2>
          </div>
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
