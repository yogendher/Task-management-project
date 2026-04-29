import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaTasks, FaColumns, FaCalendarAlt, FaChartBar, FaCog, FaBars } from 'react-icons/fa';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/tasks', icon: FaTasks, label: 'My Tasks' },
    { path: '/board', icon: FaColumns, label: 'Board' },
    { path: '/calendar', icon: FaCalendarAlt, label: 'Calendar' },
    { path: '/analytics', icon: FaChartBar, label: 'Analytics' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <div className={`bg-gray-900 text-white h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!isCollapsed && <h1 className="text-xl font-bold">TaskFlow</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded hover:bg-gray-700"
        >
          <FaBars />
        </button>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mx-2 my-1 rounded transition-colors ${
                isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <Icon className="text-lg" />
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;