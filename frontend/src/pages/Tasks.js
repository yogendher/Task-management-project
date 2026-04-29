import React, { useState, useEffect, useCallback } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../services/api';
import { useLocation } from 'react-router-dom';

const priorityOrder = { high: 1, medium: 2, low: 3 };

const statusLabel = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const statusSteps = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
};

const priorityClasses = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
};

const statusClasses = {
  todo: 'bg-slate-100 text-slate-800',
  'in-progress': 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
};

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
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '' });
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(location.state?.status || '');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  const triggerNotification = useCallback((type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const fetchTasks = useCallback(async (params = {}) => {
    try {
      const response = await getTasks(params);
      setTasks(sortTaskList(response.data.tasks, sortBy));
    } catch (error) {
      triggerNotification('error', error.response?.data?.message || 'Unable to load tasks');
    }
  }, [sortBy, triggerNotification]);

  useEffect(() => {
    // Use the initial status from location state if available
    fetchTasks({ status: location.state?.status || '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount to prevent overriding filters on sort change

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '' });
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        const response = await updateTask(editingId, form);
        setTasks((current) => current.map((task) => (task._id === editingId ? response.data.task : task)));
        clearForm();
        triggerNotification('success', 'Task updated successfully!');
      } else {
        const response = await createTask(form);
        setTasks((current) => sortTaskList([response.data.task, ...current], sortBy));
        clearForm();
        triggerNotification('success', 'New task created successfully!');
      }
    } catch (error) {
      triggerNotification('error', error.response?.data?.message || 'Unable to save task');
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
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setEditingId(task._id);
  };

  const handleStatusToggle = async (task) => {
    const nextStatus = statusSteps[task.status] || 'todo';
    try {
      const response = await updateTask(task._id, { status: nextStatus });
      setTasks((current) => current.map((item) => (item._id === task._id ? response.data.task : item)));
      triggerNotification('success', `Task moved to ${statusLabel[nextStatus]}`);
    } catch (error) {
      triggerNotification('error', error.response?.data?.message || 'Unable to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((current) => current.filter((task) => task._id !== id));
      if (editingId === id) {
        clearForm();
      }
      triggerNotification('success', 'Task deleted successfully!');
    } catch (error) {
      triggerNotification('error', error.response?.data?.message || 'Unable to delete task');
    }
  };

  const handleSortChange = (event) => {
    const nextSort = event.target.value;
    setSortBy(nextSort);
    setTasks((current) => sortTaskList(current, nextSort));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl shadow-xl border transition-all duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${notification.type === 'success' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
              {notification.type === 'success' ? '✓' : '✕'}
            </div>
            <div>
              <p className="font-semibold">{notification.type === 'success' ? 'Success' : 'Error'}</p>
              <p className="text-sm opacity-90">{notification.text}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">Tasks</h1>
              <p className="mt-2 text-slate-600">Organize your work with smart filters, task cards, and quick status controls.</p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">{tasks.length} tasks</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">{editingId ? 'Edit Task' : 'Create a Task'}</h2>
              <p className="mt-2 text-slate-500">{editingId ? 'Modify the details below to update your task.' : 'Fill out the details below to add a new task to your board.'}</p>
            </div>
            <form className="space-y-5" onSubmit={handleSave}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <p className="text-xs text-slate-500 mb-2">Set the importance level.</p>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <p className="text-xs text-slate-500 mb-2">Track the current progress phase.</p>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                <input
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {editingId ? 'Save Task' : 'Add Task'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
              <p className="mt-2 text-slate-500">Quickly find specific tasks by narrowing down your list using the filters below.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title"
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    <option value="">All</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                  >
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleFilterClear}
                  className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          {tasks.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium text-slate-900">No tasks found</h3>
              <p className="mt-2 text-slate-500">We couldn't find any tasks matching your current view. Try clearing your filters or create a new task to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={`rounded-full px-3 py-1 font-semibold ${priorityClasses[task.priority]}`}>
                          {task.priority}
                        </span>
                        <span className={`rounded-full px-3 py-1 font-semibold ${statusClasses[task.status]}`}>
                          {statusLabel[task.status]}
                        </span>
                        {task.dueDate && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleStatusToggle(task)}
                      className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Move to {statusLabel[statusSteps[task.status] || 'todo']}
                    </button>
                  </div>
                  <p className="mt-4 text-slate-600">{task.description || 'No description added yet.'}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleEdit(task)}
                      className="rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Tasks;
