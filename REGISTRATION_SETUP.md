# Registration and Account Activation Setup

This document explains how to set up and use the registration and account activation functionality in the Next-Nest application.

## Overview

The registration system allows users to create new accounts, receive activation codes via email, and activate their accounts before they can log in.

## Features

- ✅ User registration with name, email, and password
- ✅ Automatic email with activation code
- ✅ Account activation page with code verification
- ✅ Form validation (client-side and server-side)
- ✅ Password strength requirements
- ✅ Automatic redirect to activation page after registration
- ✅ Success message display on activation page
- ✅ Error handling and user feedback
- ✅ Integration with NestJS backend

## Setup Instructions

### 1. Start the Backend Server

Navigate to the server directory and start the NestJS backend:

```bash
cd server
npm install
npm run start:dev
```

The server will run on `http://localhost:3001` with the following endpoints:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/activate` - Account activation
- `POST /api/v1/auth/login` - User login

### 2. Start the Frontend Client

In a new terminal, navigate to the client directory and start the Next.js frontend:

```bash
cd client
npm install
npm run dev
```

The client will run on `http://localhost:3000`.

### 3. Environment Configuration

The client is configured to connect to the backend at `http://localhost:3001`. If you need to change this:

1. Create a `.env.local` file in the client directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

2. Or update the `next.config.ts` file with your preferred URL.

## How It Works

### Registration Flow

1. **User fills out registration form** (`/register`)
   - Name (required)
   - Email (required, must be valid format)
   - Password (required, must meet strength requirements)

2. **Form validation** (client-side)
   - Required field validation
   - Email format validation
   - Password strength validation:
     - Minimum 8 characters
     - At least 1 uppercase letter
     - At least 1 lowercase letter
     - At least 1 number
     - At least 1 special character

3. **API call to backend**
   - Client sends POST request to `/api/register`
   - Client API route forwards request to NestJS backend
   - Backend validates data and creates user account
   - Backend generates unique activation code and sends email

4. **Success redirect**
   - User is automatically redirected to `/activate`
   - Success message is displayed: "Registration successful! Please check your email for the activation code."

### Account Activation Flow

1. **User receives activation email** with unique activation code
2. **User visits activation page** (`/activate`)
3. **User enters activation code** from email
4. **Backend validates code** and activates account
5. **Success redirect** to login page with activation success message

### Password Requirements

The password must meet the following criteria:
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (!@#$%^&*)

### Error Handling

- **Validation errors**: Displayed below each field
- **API errors**: Displayed at the top of the form
- **Network errors**: Graceful fallback with user-friendly messages
- **Activation errors**: Clear feedback for invalid/expired codes

## API Endpoints

### Client API Routes

- `POST /api/register` - Handles registration requests
- `POST /api/activate` - Handles account activation requests
- `POST /api/auth/login` - Handles login requests

### Backend API Routes

- `POST /api/v1/auth/register` - User registration endpoint
- `POST /api/v1/auth/activate` - Account activation endpoint
- `POST /api/v1/auth/login` - User authentication endpoint

## Testing the Registration and Activation

1. Navigate to `http://localhost:3000/register`
2. Fill out the registration form with valid data
3. Submit the form
4. You should be redirected to the activation page with a success message
5. Check your email for the activation code
6. Enter the activation code on the activation page
7. After successful activation, you'll be redirected to the login page
8. Try logging in with your new credentials

## Troubleshooting

### Common Issues

1. **Backend not running**: Ensure the NestJS server is running on port 3001
2. **CORS errors**: The backend is configured to allow requests from localhost:3000
3. **Database connection**: Ensure MongoDB is running and accessible
4. **Port conflicts**: Check if ports 3000 or 3001 are already in use
5. **Email not sending**: Check mailer configuration in backend
6. **Activation code expired**: Check CODE_EXPIRED environment variable

### Debug Mode

To enable debug logging, check the browser console and server logs for detailed error information.

## Security Features

- Password hashing (handled by backend)
- Input validation and sanitization
- CORS protection
- Rate limiting (can be added to backend)
- Secure password requirements
- Time-limited activation codes
- Unique activation codes per user

## Future Enhancements

- Email verification resend functionality
- Password reset functionality
- Social media login integration
- Two-factor authentication
- Account activation via SMS
- Admin account approval workflow
