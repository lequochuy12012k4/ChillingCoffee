# Google OAuth Login Setup Guide

This guide explains how to set up Google OAuth login for your Next-Nest application.

## 🚀 Overview

The Google OAuth integration allows users to sign in using their Google accounts, automatically creating or updating user profiles in your system.

## ✨ Features

- ✅ **Google OAuth Integration** - Users can sign in with Google
- ✅ **Automatic User Creation** - New Google users are automatically created
- ✅ **Profile Updates** - Existing users get updated Google information
- ✅ **JWT Token Generation** - Secure authentication tokens
- ✅ **Seamless Integration** - Works with your existing auth system

## 🔧 Setup Instructions

### 1. Google OAuth Configuration

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API** and **Google OAuth2 API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy your **Client ID** and **Client Secret**

#### Step 2: Set Environment Variables

**Client (.env.local):**
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
```

**Server (.env):**
```bash
# Server Configuration
PORT=3001

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_ACCESS_TOKEN_EXPIRED=1d

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/chillingcoffee

# Email Configuration (for account activation)
MAILER_HOST=smtp.gmail.com
MAILER_PORT=587
MAILER_SECURE=false
MAILER_USER=your-email@gmail.com
MAILER_PASS=your-app-password

# Activation Code Configuration
CODE_EXPIRED=24
CODE_EXPIRED_TIME_UNIT=hours
```

### 2. Start the Servers

#### Backend Server
```bash
cd server
npm install
npm run start:dev
```

#### Frontend Client
```bash
cd client
npm install
npm run dev
```

## 🔄 How Google Login Works

### 1. **User Clicks Google Sign-In**
- User clicks "Sign in with Google" button
- NextAuth redirects to Google OAuth

### 2. **Google OAuth Flow**
- User authenticates with Google
- Google returns user profile data
- NextAuth processes the authentication

### 3. **Backend Integration**
- NextAuth sends user data to your NestJS backend
- Backend creates/updates user profile
- Backend generates JWT token
- Token is stored temporarily

### 4. **Frontend Authentication**
- Login component retrieves JWT token
- User is authenticated via AuthContext
- User is redirected to home page

## 🗄️ Database Schema Updates

The user schema now includes Google OAuth fields:

```typescript
@Schema({timestamps: true})
export class Users {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  image: string;

  @Prop({default: 'local'})
  accout_type: string; // 'local' or 'google'

  @Prop({default: 'user'})
  role: string;

  @Prop({default: false})
  isActive: boolean;

  @Prop()
  code_id: string;

  @Prop()
  code_expired: Date;

  @Prop()
  googleId: string; // Google OAuth ID

  @Prop()
  image: string; // Profile image from Google
}
```

## 🔐 Security Features

- **JWT Tokens** - Secure authentication
- **Account Type Tracking** - Distinguish between local and Google users
- **Automatic Activation** - Google users are automatically active
- **Profile Validation** - Google provides verified email addresses

## 🧪 Testing Google Login

### 1. **Start Both Servers**
- Backend on port 3001
- Frontend on port 3000

### 2. **Navigate to Login Page**
- Go to `http://localhost:3000/login`

### 3. **Click Google Sign-In**
- Click "Sign in with Google" button
- Complete Google OAuth flow

### 4. **Verify Authentication**
- Check browser console for any errors
- Verify user is redirected to home page
- Check database for new user entry

## 🚨 Troubleshooting

### Common Issues

1. **"Google sign-in failed"**
   - Check Google OAuth credentials
   - Verify redirect URIs are correct
   - Check environment variables

2. **"No access token received"**
   - Check backend server is running
   - Verify API endpoint `/api/v1/auth/google`
   - Check network requests in browser

3. **Database Connection Issues**
   - Ensure MongoDB is running
   - Check connection string
   - Verify database permissions

4. **CORS Errors**
   - Backend CORS is configured for localhost:3000
   - Check if ports match

### Debug Steps

1. **Check Browser Console** for JavaScript errors
2. **Check Network Tab** for failed API requests
3. **Check Backend Logs** for server errors
4. **Verify Environment Variables** are loaded correctly

## 🔄 Integration with Existing System

- **Local Users** - Still use email/password authentication
- **Google Users** - Automatically authenticated via OAuth
- **Mixed Accounts** - Users can have both local and Google accounts
- **Unified JWT** - Both authentication methods generate the same JWT format

## 🚀 Production Deployment

### Environment Variables
- Update `NEXTAUTH_URL` to your production domain
- Update Google OAuth redirect URIs
- Use strong `NEXTAUTH_SECRET`
- Secure `JWT_SECRET`

### Security Considerations
- Enable HTTPS in production
- Use secure cookies
- Implement rate limiting
- Monitor authentication logs

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://jwt.io/introduction)

## 🎯 Next Steps

After setting up Google OAuth:

1. **Test the complete flow** - Registration → Activation → Login
2. **Add profile management** - Allow users to update their profiles
3. **Implement logout** - Clear JWT tokens and session data
4. **Add user roles** - Implement admin/user permissions
5. **Email verification** - Optional for Google users
6. **Password reset** - For local users only

Your Google OAuth integration is now ready! Users can sign in with Google and get automatically authenticated in your system.
