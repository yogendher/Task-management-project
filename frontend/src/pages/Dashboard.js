import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-page">
      <h2>Welcome, {user?.name}</h2>
      <p>This is your task management dashboard.</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
