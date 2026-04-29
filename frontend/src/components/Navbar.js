import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaSearch, FaBell, FaUser, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/tasks', { state: { search: searchQuery } });
    }
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <form onSubmit={handleSearch} className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </form>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          to="/tasks"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Task</span>
        </Link>

        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <FaBell />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaUser className="text-gray-600" />
            <span className="text-gray-700">{user?.name}</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;