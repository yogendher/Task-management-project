import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getTasks } from '../services/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data.tasks);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const completed = tasks.filter((task) => task.status === 'completed').length;
  const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
  const pending = tasks.filter((task) => task.status === 'pending').length;

  return (
    <div className="dashboard-page">
      <h2>Welcome, {user?.name}</h2>
      <p>Here is a quick view of your task progress.</p>
      <div className="dashboard-grid">
        <div className="summary-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>
        <div className="summary-card">
          <h3>Completed</h3>
          <p>{completed}</p>
        </div>
        <div className="summary-card">
          <h3>In Progress</h3>
          <p>{inProgress}</p>
        </div>
        <div className="summary-card">
          <h3>Pending</h3>
          <p>{pending}</p>
        </div>
      </div>
      {loading ? (
        <p>Loading tasks...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : tasks.length > 0 ? (
        <div className="recent-tasks">
          <h3>Most Recent Task</h3>
          <div className="task-card">
            <h4>{tasks[0].title}</h4>
            <p>{tasks[0].description || 'No description provided.'}</p>
            <p>Status: {tasks[0].status}</p>
          </div>
        </div>
      ) : (
        <p>No tasks found yet. Use the Tasks page to add one.</p>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
