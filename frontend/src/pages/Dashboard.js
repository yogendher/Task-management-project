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
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="dashboard-page">
      <div className="page-title">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}. Track your workload, completed tasks, and priorities at a glance.</p>
      </div>

      <div className="stats-grid">
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

      <div className="overview-card">
        <div className="overview-content">
          <h3>Task Completion</h3>
          <p>{progress}% completed across your task list.</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
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
            <div className="task-card-header">
              <h3>{tasks[0].title}</h3>
              <span className={`priority ${tasks[0].priority}`}>{tasks[0].priority}</span>
            </div>
            <p>{tasks[0].description || 'No description provided.'}</p>
            <div className="task-card-meta">
              <span className={`status-pill ${tasks[0].status}`}>{tasks[0].status}</span>
              <span>{tasks[0].dueDate ? new Date(tasks[0].dueDate).toLocaleDateString() : 'No due date'}</span>
            </div>
          </div>
        </div>
      ) : (
        <p>No tasks found yet. Use the Tasks page to add one.</p>
      )}

      <button className="secondary-button" onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
