# Authentication Setup Guide

## Overview
This project implements a complete authentication system with:
- Client-side login form with email/password
- Google OAuth integration via NextAuth.js
- Backend JWT authentication with MongoDB
- Automatic redirect to home page after login
- User name display in navbar when logged in

## Setup Instructions

### 1. Backend Server Setup
1. Navigate to the server directory: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_ACCESS_TOKEN_EXPIRED=1d
   ```
4. Start the server: `npm run dev`

### 2. Frontend Client Setup
1. Navigate to the client directory: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
4. Start the client: `npm run dev`

### 3. Database Setup
1. Ensure MongoDB is running
2. Create a test user in the database:
   ```javascript
   // Example user document
   {
     "name": "Test User",
     "email": "test@example.com",
     "password": "hashed_password",
     "role": "user",
     "isActive": true
   }
   ```

## Testing the Authentication

### 1. Test Login Flow
1. Navigate to `/login` page
2. Enter valid email/password credentials
3. Click "Sign in"
4. Should redirect to home page
5. Navbar should show user name next to account icon

### 2. Test Logout
1. Click logout button in navbar
2. Should return to unauthenticated state
3. Navbar should show login link

### 3. Test Google OAuth
1. Click "Sign in with Google" button
2. Should redirect to Google OAuth
3. After successful authentication, redirect to home page

## API Endpoints

### Backend (NestJS)
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile (protected)
- `POST /api/v1/auth/register` - User registration

### Frontend (Next.js)
- `POST /api/auth/login` - Proxy to backend login
- `GET /api/auth/profile` - Proxy to backend profile

## File Structure

### Client
- `src/app/contexts/AuthContext.tsx` - Authentication state management
- `src/app/components/client/Authentication/Login.tsx` - Login form
- `src/app/components/client/Navbar.tsx` - Navigation with user info
- `src/app/api/auth/*` - API route proxies

### Server
- `src/auth/auth.controller.ts` - Authentication endpoints
- `src/auth/auth.service.ts` - Authentication business logic
- `src/modules/users/users.service.ts` - User management
- `src/auth/passport/*` - Passport strategies and guards

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure backend allows requests from frontend origin
2. **JWT token issues**: Check JWT_SECRET environment variable
3. **Database connection**: Verify MongoDB connection string
4. **Port conflicts**: Ensure ports 3000 (client) and 3001 (server) are available

### Debug Steps
1. Check browser console for frontend errors
2. Check server console for backend errors
3. Verify environment variables are set correctly
4. Test API endpoints directly with tools like Postman

