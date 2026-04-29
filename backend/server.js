require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const Task = require("./models/Task");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("Boot file:", __filename);
console.log("Node entry:", require.main?.filename || process.argv[1]);

// middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", require('./routes/taskRoutes'));

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    dbState: mongoose.connection.readyState,
  });
});

async function connectToDatabase() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  console.log("MongoDB Connected");
}

async function seedDemoAccount() {
  const email = 'lucky@gmail.com';
  const password = 'lucky123';
  const name = 'Lucky User';

  let user = await User.findOne({ email });
  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });
    console.log('Created demo user:', email);
  }

  const existingTasks = await Task.find({ user: user._id });
  if (existingTasks.length > 0) {
    console.log(`Demo user ${email} already has ${existingTasks.length} tasks. Skipping seed.`);
    return; // Prevent adding duplicates or overriding user-deleted tasks
  }

  const taskSamples = [
    {
      title: 'Plan sprint backlog',
      description: 'Define the next sprint scope and prioritize stories.',
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      tags: ['planning', 'sprint'],
    },
    {
      title: 'Design landing page',
      description: 'Build the landing page layout and finalize the hero section.',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      tags: ['design', 'frontend'],
    },
    {
      title: 'Write API documentation',
      description: 'Document all task and auth endpoints for the team.',
      status: 'todo',
      priority: 'low',
      dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      tags: ['documentation'],
    },
    {
      title: 'Review pull request #42',
      description: 'Check the backend task updates and approve the merge.',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      tags: ['review', 'backend'],
    },
    {
      title: 'Fix auth redirect',
      description: 'Resolve the login redirect issue and improve session handling.',
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['bugfix', 'auth'],
    },
    {
      title: 'Schedule team sync',
      description: 'Plan the next product sync meeting and share the agenda.',
      status: 'done',
      priority: 'medium',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['meeting'],
    },
    {
      title: 'Test mobile responsiveness',
      description: 'Verify app layout on phones and tablets.',
      status: 'done',
      priority: 'medium',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['testing', 'ui'],
    },
    {
      title: 'Update analytics chart',
      description: 'Refine the dashboard chart and progress metrics.',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      tags: ['analytics'],
    },
    {
      title: 'Clean up old tasks',
      description: 'Archive completed tasks and remove stale items.',
      status: 'todo',
      priority: 'low',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tags: ['cleanup'],
    },
    {
      title: 'Deploy latest build',
      description: 'Push the updated UI and API to production.',
      status: 'todo',
      priority: 'high',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      tags: ['deploy'],
    },
  ];

  await Task.create(taskSamples.map((task) => ({ ...task, user: user._id })));
  console.log(`Seeded ${taskSamples.length} demo tasks for ${email}`);
}

async function startServer() {
  try {
    await connectToDatabase();
    await seedDemoAccount();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
