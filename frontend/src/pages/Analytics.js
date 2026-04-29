import React, { useState, useEffect } from 'react';
import { getTasks } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data.tasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  // Process metrics for charts
  const statusCount = { 'todo': 0, 'in-progress': 0, 'done': 0 };
  const priorityCount = { 'low': 0, 'medium': 0, 'high': 0 };

  tasks.forEach(task => {
    if (statusCount[task.status] !== undefined) statusCount[task.status]++;
    if (priorityCount[task.priority] !== undefined) priorityCount[task.priority]++;
  });

  const pieData = [
    { name: 'To Do', value: statusCount['todo'], color: '#cbd5e1' },
    { name: 'In Progress', value: statusCount['in-progress'], color: '#93c5fd' },
    { name: 'Done', value: statusCount['done'], color: '#6ee7b7' }
  ];

  const barData = [
    { name: 'Low', count: priorityCount['low'], fill: '#34d399' },
    { name: 'Medium', count: priorityCount['medium'], fill: '#fbbf24' },
    { name: 'High', count: priorityCount['high'], fill: '#fb7185' }
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics Overview</h1>
        <p className="mt-2 text-slate-600">Visualize your task progress and priorities.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Pie Chart */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 w-full">Tasks by Status</h2>
          {tasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 h-64">No data available</div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Tasks']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200 flex flex-col items-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 w-full">Tasks by Priority</h2>
          {tasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 h-64">No data available</div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" radius={[6, 6, 6, 6]}>
                    {barData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}