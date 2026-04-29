const Task = require('../models/Task');

async function getTasks(req, res) {
  try {
    const { status, priority, search } = req.query;
    const filter = { user: req.user._id };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const tasks = await Task.find(filter).sort({ dueDate: 1, createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load tasks', error: error.message });
  }
}

async function createTask(req, res) {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description?.trim(),
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updates = ['title', 'description', 'status', 'priority', 'dueDate'];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = field === 'dueDate' ? new Date(req.body[field]) : req.body[field];
      }
    });

    await task.save();
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task', error: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task', error: error.message });
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask };
