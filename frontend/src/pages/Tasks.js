import React, { useState, useEffect, useCallback } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../services/api';

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
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '' });
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
    setForm({ title: '', description: '', priority: 'medium', status: 'todo', dueDate: '' });
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
      status: task.status,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setEditingId(task._id);
    setMessage(null);
  };

  const handleStatusToggle = async (task) => {
    const nextStatus = statusSteps[task.status] || 'todo';
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
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
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
              <p className="mt-2 text-slate-500">{editingId ? 'Update your task details and status.' : 'Add a new task to keep your board moving.'}</p>
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
            {message && <p className="mt-4 text-sm text-rose-600">{message}</p>}
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Filters</h2>
              <p className="mt-2 text-slate-500">Narrow your task list by status, priority, or keyword.</p>
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
            <p className="text-slate-600">No tasks yet. Create one to get started.</p>
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
