import React, { useState, useEffect, useCallback } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../services/api';

const priorityOrder = { high: 1, medium: 2, low: 3 };

const sortTaskList = (tasks, sortBy) => {
  const sorted = [...tasks];

  switch (sortBy) {
    case 'priority':
      return sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case 'createdAtDesc':
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'createdAtAsc':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'dueDateDesc':
      return sorted.sort((a, b) => new Date(b.dueDate || 0) - new Date(a.dueDate || 0));
    default:
      return sorted.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
  }
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  const fetchTasks = useCallback(async (params = {}) => {
    try {
      const response = await getTasks(params);
      setTasks(sortTaskList(response.data.tasks, sortBy));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load tasks');
    }
  }, [sortBy]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
    setEditingId(null);
    setMessage(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await updateTask(editingId, form);
        setTasks((current) => current.map((task) => (task._id === editingId ? response.data.task : task)));
        clearForm();
      } else {
        const response = await createTask(form);
        setTasks((current) => sortTaskList([response.data.task, ...current], sortBy));
        clearForm();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save task');
    }
  };

  const handleSearch = () => {
    fetchTasks({ search, status: statusFilter, priority: priorityFilter });
  };

  const handleFilterClear = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    fetchTasks();
  };

  const handleEdit = (task) => {
    setForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setEditingId(task._id);
    setMessage(null);
  };

  const handleStatusToggle = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const response = await updateTask(task._id, { status: nextStatus });
      setTasks((current) => current.map((item) => (item._id === task._id ? response.data.task : item)));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
      if (editingId === id) {
        clearForm();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete task');
    }
  };

  const handleSortChange = (event) => {
    const nextSort = event.target.value;
    setSortBy(nextSort);
    setTasks((current) => sortTaskList(current, nextSort));
  };

  return (
    <div className="tasks-page">
      <div className="page-title">
        <h1>Tasks</h1>
        <p>Organize your tasks with filters, sorting, and priority controls.</p>
      </div>

      <div className="task-header">
        <div>
          <h2>{editingId ? 'Edit Task' : 'Create a Task'}</h2>
          <p>{editingId ? 'Update your task details' : 'Add a new task to your list.'}</p>
        </div>
        <div className="task-header-actions">
          <span className="task-count">{tasks.length} tasks</span>
          <button className="secondary-button" type="button" onClick={clearForm}>
            Reset Form
          </button>
        </div>
      </div>

      <div className="tasks-panel">
        <form className="task-form" onSubmit={handleSave}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>
          <label>
            Priority
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            Due date
            <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
          </label>
          <div className="task-form-actions">
            <button type="submit">{editingId ? 'Save Task' : 'Add Task'}</button>
            {editingId && (
              <button type="button" className="secondary-button" onClick={clearForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
        {message && <p className="error">{message}</p>}
      </div>

      <div className="tasks-list">
        <div className="task-filters">
          <div className="task-filter-group">
            <label>
              Search
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title" />
            </label>
          </div>
          <div className="task-filter-group">
            <label>
              Status
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
          <div className="task-filter-group">
            <label>
              Priority
              <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <div className="task-filter-group">
            <label>
              Sort by
              <select value={sortBy} onChange={handleSortChange}>
                <option value="dueDateAsc">Due Date ↑</option>
                <option value="dueDateDesc">Due Date ↓</option>
                <option value="priority">Priority</option>
                <option value="createdAtDesc">Newest</option>
                <option value="createdAtAsc">Oldest</option>
              </select>
            </label>
          </div>
          <div className="task-filter-actions">
            <button type="button" onClick={handleSearch}>
              Apply
            </button>
            <button type="button" className="secondary-button" onClick={handleFilterClear}>
              Clear
            </button>
          </div>
        </div>

        {tasks.length === 0 ? (
          <p>No tasks yet. Create one to get started.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <span className={`priority ${task.priority}`}>{task.priority}</span>
              </div>
              <p>{task.description || 'No description provided.'}</p>
              <div className="task-card-meta">
                <span className={`status-pill ${task.status}`}>{task.status}</span>
                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
              </div>
              <div className="task-card-actions">
                <button onClick={() => handleStatusToggle(task)}>
                  {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                </button>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task._id)} className="delete-button">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
