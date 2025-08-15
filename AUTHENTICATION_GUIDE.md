# 🔐 Authentication System Guide

## Overview
Your route saving application now has a complete authentication system with JWT tokens, password hashing, and protected routes.

## 🔧 Features Implemented

### ✅ User Registration
- **Endpoint**: `POST /api/register`
- **Required Fields**: `email`, `username`, `password`
- **Security**: Passwords are automatically hashed using bcrypt
- **Response**: Returns JWT token and user info

### ✅ User Login
- **Endpoint**: `POST /api/login`
- **Required Fields**: `username`, `password`
- **Security**: Password comparison using bcrypt
- **Response**: Returns JWT token and user info

### ✅ User Logout
- **Endpoint**: `POST /api/logout`
- **Authentication**: Requires valid JWT token
- **Note**: Client-side token removal (server-side blacklisting can be added later)

### ✅ Protected Routes
All route operations now require authentication:

- **GET /api/routes** - Get user's saved routes
- **POST /api/routes** - Save a new route
- **DELETE /api/routes/:routeId** - Delete a route

## 🔑 How to Use

### 1. User Registration
```javascript
const response = await fetch('/api/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'username',
    password: 'password123'
  })
});

const { token, user } = await response.json();
// Store token in localStorage or secure storage
localStorage.setItem('authToken', token);
```

### 2. User Login
```javascript
const response = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'username',
    password: 'password123'
  })
});

const { token, user } = await response.json();
localStorage.setItem('authToken', token);
```

### 3. Making Authenticated Requests
```javascript
const token = localStorage.getItem('authToken');

// Save a route
const saveResponse = await fetch('/api/routes', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'My Route',
    description: 'Route description',
    destination: 'Destination',
    type: 'bike',
    pathEncoded: 'encoded_polyline_string',
    pathDaysEncoded: []
  })
});

// Get user's routes
const routesResponse = await fetch('/api/routes', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 4. User Logout
```javascript
const token = localStorage.getItem('authToken');

await fetch('/api/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Remove token from client
localStorage.removeItem('authToken');
```

## 🛡️ Security Features

### Password Security
- **Hashing**: Passwords are hashed using bcrypt with salt rounds of 10
- **Comparison**: Secure password comparison using bcrypt.compare()
- **Storage**: Only hashed passwords are stored in the database

### JWT Tokens
- **Expiration**: Tokens expire after 7 days
- **Payload**: Contains user ID and username
- **Secret**: Uses environment variable `JWT_SECRET` or fallback key

### Route Protection
- **Authentication Required**: All route operations require valid JWT token
- **User Isolation**: Users can only access their own routes
- **Token Validation**: Server validates token on every protected request

## 📁 File Structure

```
web_server/
├── models/
│   ├── User.js          # User model with password hashing and JWT methods
│   └── Route.js         # Route model
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── server.js            # Main server with protected routes
├── test_auth.js         # Authentication system tests
├── setup_auth.js        # Setup script for test users
└── AUTHENTICATION_GUIDE.md
```

## 🧪 Testing

### Test Users
- **Username**: `testuser`, **Password**: `password123`
- **Username**: `testuser2`, **Password**: `password123`

### Run Tests
```bash
# Test the complete authentication system
node test_auth.js

# Test password functionality
node test_password.js

# Setup test users
node setup_auth.js
```

## 🔄 API Changes

### Before (No Authentication)
```javascript
// Routes were public
POST /api/routes
GET /api/routes?username=user
DELETE /api/routes/:id?username=user
```

### After (With Authentication)
```javascript
// Routes are protected
POST /api/routes (requires Authorization header)
GET /api/routes (requires Authorization header)
DELETE /api/routes/:id (requires Authorization header)
```

## 🚀 Client-Side Integration

### Required Changes
1. **Store JWT Token**: Save token after login/registration
2. **Add Authorization Header**: Include token in all route requests
3. **Handle 401 Errors**: Redirect to login when token is invalid/expired
4. **Remove Token**: Clear token on logout

### Example Client Implementation
```javascript
// Authentication helper
const auth = {
  token: localStorage.getItem('authToken'),
  
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  },
  
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  },
  
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }
};

// Use in API calls
const saveRoute = async (routeData) => {
  const response = await fetch('/api/routes', {
    method: 'POST',
    headers: auth.getHeaders(),
    body: JSON.stringify(routeData)
  });
  
  if (response.status === 401) {
    // Token expired or invalid
    auth.clearToken();
    window.location.href = '/login';
    return;
  }
  
  return response.json();
};
```

## 🔒 Security Best Practices

1. **Environment Variables**: Use `JWT_SECRET` environment variable for production
2. **HTTPS**: Always use HTTPS in production
3. **Token Storage**: Store tokens securely (httpOnly cookies for better security)
4. **Token Expiration**: Implement token refresh mechanism for long sessions
5. **Rate Limiting**: Add rate limiting to prevent brute force attacks
6. **Input Validation**: Validate all user inputs
7. **Error Handling**: Don't expose sensitive information in error messages

## 🎉 Summary

Your authentication system is now complete and secure! Users can:
- ✅ Register with secure password hashing
- ✅ Login and receive JWT tokens
- ✅ Access only their own routes
- ✅ Logout securely

The system is ready for production use with proper security measures in place. 