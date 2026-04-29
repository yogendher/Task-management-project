import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getTasks } from '../services/api';

const TaskCalendar = ({ onEditTask }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayTasks = getTasksForDate(date);
      if (dayTasks.length > 0) {
        return (
          <div className="flex justify-center mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold text-slate-900">Calendar</h1>
            <p className="text-slate-600">View and manage your tasks by date.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
              className="w-full border-none font-sans"
          />
        </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Tasks for {selectedDate.toLocaleDateString()}</h2>
            
          {selectedDateTasks.length === 0 ? (
              <p className="text-slate-500">No tasks for this date. Enjoy your day!</p>
          ) : (
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
                <div
                  key={task._id}
                    className="p-5 border border-slate-200 rounded-3xl bg-slate-50 cursor-pointer hover:bg-slate-100 hover:shadow-sm transition-all"
                  onClick={() => onEditTask(task)}
                >
                    <h3 className="font-semibold text-slate-900">{task.title}</h3>
                    <p className="text-sm text-slate-600 mt-2">{task.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.priority === 'high' ? 'bg-rose-100 text-rose-800' :
                        task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'done' ? 'bg-emerald-100 text-emerald-800' :
                        task.status === 'in-progress' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-200 text-slate-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendar;