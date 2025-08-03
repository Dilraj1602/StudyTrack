# StudyTrack Backend Deployment Guide

## Authentication Issues Fix

The main authentication issues in production have been fixed:

### 1. Cookie Configuration
- Fixed cookie settings for production deployment
- Added proper `sameSite`, `secure`, and `path` attributes
- Improved cookie clearing on logout

### 2. CORS Configuration
- Enhanced CORS settings to handle credentials properly
- Added better error logging for debugging
- Included multiple allowed origins

### 3. Token Handling
- Improved token verification in middleware
- Added fallback to Authorization header when cookies fail
- Enhanced error logging for debugging

## Production Environment Variables

Make sure to set these environment variables in your production environment (e.g., Render.com):

```bash
NODE_ENV=production
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_very_long_and_secure_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

## Testing Authentication

After deployment, you can test the authentication flow:

1. **Using the test script:**
   ```bash
   cd server
   npm install axios
   API_URL=https://your-backend-url.onrender.com node test-auth.js
   ```

2. **Manual testing:**
   - Test the health endpoint: `GET /health`
   - Register a new user: `POST /api/v1/auth/register`
   - Login: `POST /api/v1/auth/login`
   - Get current user: `GET /api/v1/auth/current-user`
   - Logout: `POST /api/v1/auth/logout`

## Common Issues and Solutions

### Issue: Users keep getting logged out
**Solution:** The cookie configuration has been fixed to work properly in production with HTTPS.

### Issue: CORS errors
**Solution:** CORS has been configured to handle credentials and multiple origins properly.

### Issue: Token not found
**Solution:** The system now checks both cookies and Authorization headers for tokens.

## Frontend Configuration

Make sure your frontend is configured to:
1. Send credentials with requests (`withCredentials: true`)
2. Use the correct backend URL
3. Handle both cookie and header-based authentication

## Monitoring

The server now includes:
- Request logging for debugging
- Health check endpoint
- Better error messages
- Token verification logging

## Deployment Checklist

- [ ] Set `NODE_ENV=production` in environment variables
- [ ] Ensure `JWT_SECRET` is set and secure
- [ ] Configure MongoDB connection string
- [ ] Set up proper CORS origins
- [ ] Test authentication flow after deployment
- [ ] Monitor server logs for any issues 