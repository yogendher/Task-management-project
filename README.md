# Task Management Project

A MERN-based task management application with authentication and a strong foundation for building a team-oriented productivity tool.

## Project Overview

This app is designed to showcase a full-stack MERN project with:
- User authentication using JWT and bcrypt
- Protected backend routes
- A future task management dashboard and user profile features
- Deployment-ready backend and frontend architecture

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT, bcrypt
- Frontend: React (to be implemented)
- Deployment: Render for backend, Vercel for frontend, MongoDB Atlas for database

## Current Backend Features

- User registration (`POST /api/auth/register`)
- User login (`POST /api/auth/login`)
- Protected user profile route (`GET /api/auth/profile`)

## Structure

- `backend/`
  - `controllers/` - auth controller functions
  - `middleware/` - JWT auth middleware
  - `models/` - Mongoose user schema
  - `routes/` - auth route definitions
  - `server.js` - Express server setup

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

## Frontend Plan

The frontend is planned as a React app in the `frontend/` folder, with:
- Login/Register pages
- Auth context and token storage
- Protected routes
- Task management dashboard
- Responsive UI

## Deployment Plan

- Backend: Deploy to Render
- Frontend: Deploy to Vercel
- Database: MongoDB Atlas

## Notes

This repository is currently set up with backend authentication and ready for frontend development. The next steps are to build the React frontend and task management features.
