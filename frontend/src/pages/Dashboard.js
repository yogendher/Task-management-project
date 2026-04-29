import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getTasks } from '../services/api';

const statusLabel = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

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

  const totalTasks = tasks.length;
  const completed = tasks.filter((task) => task.status === 'done').length;
  const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
  const todoCount = tasks.filter((task) => task.status === 'todo').length;
  const progress = totalTasks ? Math.round((completed / totalTasks) * 100) : 0;

  const dueSoonTasks = tasks
    .filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      const inThreeDays = new Date();
      inThreeDays.setDate(today.getDate() + 3);
      return dueDate >= today && dueDate <= inThreeDays;
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500 font-semibold">Welcome back</p>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">Hi, {user?.name || 'there'}.</h1>
              <p className="mt-3 max-w-2xl text-slate-600">Your dashboard gives you a quick overview of tasks, progress, and anything due soon so you can stay focused.</p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Total Tasks</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{totalTasks}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="mt-4 text-3xl font-semibold text-green-600">{completed}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">In Progress</p>
            <p className="mt-4 text-3xl font-semibold text-amber-600">{inProgress}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">To Do</p>
            <p className="mt-4 text-3xl font-semibold text-sky-700">{todoCount}</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Completion rate</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{progress}%</h2>
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">Data refreshed automatically</div>
            </div>
            <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-4 text-sm text-slate-500">Keep moving tasks forward to improve your completion rate.</p>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Due soon</p>
            <div className="mt-5 space-y-4">
              {dueSoonTasks.length === 0 ? (
                <p className="text-sm text-slate-500">No tasks due in the next few days. Nice work!</p>
              ) : (
                dueSoonTasks.map((task) => (
                  <div key={task._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{task.title}</h3>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">{statusLabel[task.status]}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{task.description || 'No description available.'}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/40 ring-1 ring-slate-200">
          {loading ? (
            <p className="text-slate-600">Loading tasks...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : tasks.length === 0 ? (
            <p className="text-slate-600">No tasks available yet. Add tasks from the Tasks page.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Latest tasks</p>
                  <h2 className="text-xl font-semibold text-slate-900">Quick overview</h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">{tasks.length} total</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task._id} className="rounded-3xl border border-slate-200 p-5 shadow-sm bg-slate-50">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{task.title}</h3>
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">{statusLabel[task.status]}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{task.description || 'No description available.'}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">{task.priority}</span>
                      {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
