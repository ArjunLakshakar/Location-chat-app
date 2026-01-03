# Location-Based Chat App
A real-time chat application where users can:
Create chatrooms tied to GPS location
Restrict joining based on radius distance
Join only when they are physically nearby
Chat in real-time using Socket.io
Login using Email/Password or Google OAuth
View live participants list
Edit chatroom name (creator only)
Delete chatroom (creator only)
Auto-block chat after 2 hours


# 🚀 Tech Stack

Frontend
React
Tailwind CSS
Axios
Socket.io Client

Backend
Node.js
Express
MongoDB + Mongoose
JWT Authentication


# ✨ Features
👤 Authentication
Register / Login with email & password
JWT Secured routes

# 📍 Location-based rooms
Users create rooms with location stored
Radius setting (e.g., 2 km)
Only users inside allowed radius can join
Join validation happens server-side

# 💬 Real-time chat
Socket.io live messaging
Message persistence in MongoDB
Auto-scroll chat view
Chat expires after 2 hours

# 👥 Participants list
Live active users displayed
Duplicate names prevented
Auto-remove user on leave

# 🛠 Room owner abilities
Edit room name
Delete room
Restrict join radius


# Backend Setup
cd backend
npm install
npm run dev

# frontend Setup 
cd frontend
npm install
npm run dev
