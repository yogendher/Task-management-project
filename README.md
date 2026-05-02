# Task Management Project

A MERN-based task management application with authentication and a strong foundation for building a team-oriented productivity tool.

## Project Overview

This app is designed to showcase a full-stack MERN project with:
- User authentication using JWT and bcrypt
- Protected backend routes
- Task management dashboard and CRUD features, including task editing, status updates, and task filtering
- Deployment-ready backend and frontend architecture

## Tech Stack

- Frontend: React, Tailwind CSS, React Router, Recharts, @dnd-kit, React Calendar
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT, bcrypt
- Deployment: Render for backend, Vercel for frontend, MongoDB Atlas for database

## Features

- User registration (`POST /api/auth/register`)
- User login (`POST /api/auth/login`)
- Task management CRUD API
- Kanban Board for drag-and-drop task status updates
- Calendar View to see tasks by due dates
- Analytics Dashboard with charts for task status and priority
- Settings page to manage profile and preferences
- Responsive and modern UI powered by Tailwind CSS

## Structure

- `backend/`
  - `controllers/` - Auth & Task controller functions
  - `middleware/` - JWT auth middleware
  - `models/` - Mongoose schemas (User, Task)
  - `routes/` - API route definitions
  - `server.js` - Express server setup
- `frontend/`
  - `src/`
    - `components/` - Reusable UI components
    - `context/` - Auth Context for global state
    - `pages/` - App pages (Dashboard, Tasks, Board, etc.)
    - `services/` - Axios API service integrations
    - `App.js` - Main application entry point

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yogendher/Task-management-project.git
   cd Task-management-project
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in `backend/` with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Open a new terminal, install frontend dependencies, and start the React app:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Deployment Plan

- Backend: Deploy to Render
- Frontend: Deploy to Vercel
- Database: MongoDB Atlas
