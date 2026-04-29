import React, { useState, useEffect } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../services/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });
  const [message, setMessage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
        setTasks(tasks.map((task) => (task._id === editingId ? response.data.task : task)));
        clearForm();
      } else {
        const response = await createTask(form);
        setTasks([response.data.task, ...tasks]);
        clearForm();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save task');
    }
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
      setTasks(tasks.map((item) => (item._id === task._id ? response.data.task : item)));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
      if (editingId === id) {
        clearForm();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to delete task');
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-panel">
        <h2>{editingId ? 'Edit Task' : 'Create a Task'}</h2>
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
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet. Create one to get started.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className={`task-card ${task.status}`}>
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <span className={`priority ${task.priority}`}>{task.priority}</span>
              </div>
              <p>{task.description || 'No description provided.'}</p>
              <div className="task-card-meta">
                <span>{task.status}</span>
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
