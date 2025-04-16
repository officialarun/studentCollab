# Student Collaboration Platform

A platform where college students can find and collaborate on projects based on their tech stack interests.

## Features

- User authentication (signup/login)
- Project creation and management
- Tech stack-based project discovery
- Collaboration requests and management
- Real-time notifications
- User profiles with project history
- Session-based authentication

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js for authentication
- Express-session for session management

### Frontend (Coming Soon)
- React.js
- Material-UI
- Redux for state management

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd student-collab-platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-collab
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=development
```

4. Start MongoDB service

5. Start the backend server:
```bash
npm run dev
```

The backend server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/current-user` - Get current user details

### Projects
- GET `/api/projects` - Get all projects (with optional tech stack filter)
- GET `/api/projects/:id` - Get project by ID
- POST `/api/projects` - Create new project
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project
- POST `/api/projects/:id/collaborate` - Request collaboration
- POST `/api/projects/:id/handle-request` - Handle collaboration request

### User
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- GET `/api/users/notifications` - Get user notifications
- PUT `/api/users/notifications/:notificationId/read` - Mark notification as read
- GET `/api/users/projects` - Get user's projects
- GET `/api/users/collaborations` - Get user's collaborations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 