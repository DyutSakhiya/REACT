import React, { useState, useEffect } from "react";
import { Home, Users, Settings, Package, ShoppingCart, BarChart2, Menu, X, Table, Building2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../admin/context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, hotelData } = useAuth(); // Get hotelData from context
  const [hotelLogo, setHotelLogo] = useState(null);

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: Table, label: "Tables", path: "/admin/tables" },
  ];

  // Update hotel logo when user or hotelData changes
  useEffect(() => {
    let logo = null;
    
    // Priority 1: Check hotelData from context (from URL parameter)
    if (hotelData && hotelData.success && hotelData.hotelLogo) {
      logo = hotelData.hotelLogo.url;
    }
    // Priority 2: Check user data (from login)
    else if (user && user.hotelLogo) {
      if (user.hotelLogo.url) {
        logo = user.hotelLogo.url;
      } else if (user.hotelLogo.data && user.hotelLogo.contentType) {
        logo = `data:${user.hotelLogo.contentType};base64,${user.hotelLogo.data}`;
      }
    }
    
    setHotelLogo(logo);
  }, [user, hotelData]);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Get hotel name with priority
  const getHotelName = () => {
    if (hotelData && hotelData.success && hotelData.hotelname) {
      return hotelData.hotelname;
    } else if (user && user.hotelname) {
      return user.hotelname;
    }
    return "Flavaro Admin";
  };

  const hotelName = getHotelName();
  
  // Function to display logo component
  const displayLogo = (size = 'medium') => {
    const sizes = {
      small: 'w-8 h-8',
      medium: 'w-12 h-12',
      large: 'w-16 h-16'
    };
    
    if (hotelLogo) {
      return (
        <img 
          src={hotelLogo} 
          alt="Hotel Logo" 
          className={`${sizes[size] || sizes.medium} rounded-full object-cover border border-gray-300 shadow-sm`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentNode.innerHTML = `
              <div class="${sizes[size] || sizes.medium} rounded-full bg-orange-100 border border-gray-300 flex items-center justify-center">
                <span class="text-lg font-bold text-orange-600">${hotelName.charAt(0)}</span>
              </div>
            `;
          }}
        />
      );
    } else {
      return (
        <div className={`${sizes[size] || sizes.medium} rounded-full bg-orange-100 border border-gray-300 flex items-center justify-center`}>
          <span className={`${size === 'small' ? 'text-sm' : 'text-lg'} font-bold text-orange-600`}>
            {hotelName.charAt(0)}
          </span>
        </div>
      );
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b p-4 fixed top-0 left-0 right-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {displayLogo('small')}
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
            {displayLogo('medium')}
            <div>
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {hotelName}
              </h2>
             
            </div>
          </div>
        </div>
        
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {displayLogo('small')}
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