# Render Deployment Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                  https://your-app.onrender.com                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    RENDER STATIC SITE                           │
│                      (Frontend - React)                         │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  • React Application (Vite Build)                         │ │
│  │  • Served from /dist folder                               │ │
│  │  • Environment: VITE_API_URL                              │ │
│  │  • SPA Routing: _redirects file                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Calls
                             │ (axios requests)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     RENDER WEB SERVICE                          │
│                    (Backend - Node.js/Express)                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  • Express Server                                         │ │
│  │  • RESTful API Endpoints                                  │ │
│  │  • JWT Authentication                                     │ │
│  │  • CORS Configuration                                     │ │
│  │  • Environment Variables:                                 │ │
│  │    - MONGODB_URI                                          │ │
│  │    - JWT_SECRET                                           │ │
│  │    - FRONTEND_URL                                         │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Database Queries
                             │ (Mongoose)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB ATLAS                              │
│                    (Database - Cloud)                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Collections:                                             │ │
│  │  • users                                                  │ │
│  │  • transactions                                           │ │
│  │  • accounts                                               │ │
│  │  • transfers                                              │ │
│  │                                                           │ │
│  │  Network Access: 0.0.0.0/0 (Allow from anywhere)         │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### 1. User Login Flow
```
User Browser
    │
    ├─→ GET https://your-frontend.onrender.com/login
    │   └─→ Render Static Site serves React app
    │
    ├─→ POST https://your-backend.onrender.com/api/auth/login
    │   └─→ Backend validates credentials
    │       └─→ MongoDB Atlas checks user collection
    │           └─→ Returns JWT token
    │
    └─→ Store token in localStorage
```

### 2. Dashboard Data Flow
```
User Browser
    │
    ├─→ GET https://your-frontend.onrender.com/dashboard
    │   └─→ React app loads
    │
    ├─→ GET https://your-backend.onrender.com/api/dashboard/summary
    │   └─→ Backend (with JWT token in header)
    │       └─→ MongoDB Atlas queries transactions & accounts
    │           └─→ Returns aggregated data
    │
    └─→ Display charts and statistics
```

## 🌐 Environment Variables Flow

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend.onrender.com
         │
         └─→ Used by axios in src/services/api.js
             └─→ All API calls go to this URL
```

### Backend (Render Environment)
```
MONGODB_URI=mongodb+srv://...
    │
    └─→ Used by mongoose.connect()
        └─→ Connects to MongoDB Atlas

JWT_SECRET=random_64_char_string
    │
    └─→ Used for signing/verifying JWT tokens
        └─→ Authentication middleware

FRONTEND_URL=https://your-frontend.onrender.com
    │
    └─→ Used in CORS configuration
        └─→ Allows frontend to make API calls
```

## 📦 Deployment Process

### Backend Deployment
```
1. Push code to Git
   └─→ Render detects changes
       └─→ Runs: npm install
           └─→ Runs: npm start
               └─→ Server starts on assigned PORT
                   └─→ Connects to MongoDB
                       └─→ Service is LIVE ✅
```

### Frontend Deployment
```
1. Push code to Git
   └─→ Render detects changes
       └─→ Runs: npm install
           └─→ Runs: npm run build
               └─→ Generates /dist folder
                   └─→ Serves static files
                       └─→ Site is LIVE ✅
```

## 🔒 Security Flow

```
User Request
    │
    ├─→ Login with credentials
    │   └─→ Backend validates
    │       └─→ Returns JWT token
    │
    ├─→ Store token in localStorage
    │
    └─→ Subsequent requests include token
        └─→ Authorization: Bearer <token>
            └─→ Backend middleware verifies token
                └─→ Grants/Denies access
```

## 🚨 Error Handling

```
API Request Error
    │
    ├─→ 401 Unauthorized
    │   └─→ Clear localStorage
    │       └─→ Redirect to /login
    │
    ├─→ 404 Not Found
    │   └─→ _redirects file catches
    │       └─→ Serves index.html (SPA routing)
    │
    └─→ 500 Server Error
        └─→ Display error message
            └─→ Check Render logs
```

## 📊 Data Flow Example: Creating a Transaction

```
1. User fills form in React app
   └─→ /transactions/new

2. Form submission
   └─→ POST /api/transactions
       Headers: { Authorization: Bearer <token> }
       Body: { amount, category, type, ... }

3. Backend receives request
   └─→ Middleware verifies JWT token
       └─→ Extract userId from token
           └─→ Create transaction in MongoDB
               └─→ Update account balance
                   └─→ Return success response

4. Frontend receives response
   └─→ Update UI
       └─→ Redirect to transactions list
           └─→ Fetch updated data
```

## 🔄 Continuous Deployment

```
Developer Workflow:

1. Make code changes locally
   └─→ Test locally (npm run dev)

2. Commit changes
   └─→ git add .
   └─→ git commit -m "message"

3. Push to repository
   └─→ git push origin main

4. Render auto-deploys
   ├─→ Backend: Detects changes in /backend
   │   └─→ Rebuilds and restarts service
   │
   └─→ Frontend: Detects changes in /frontend
       └─→ Rebuilds and redeploys static site

5. Monitor deployment
   └─→ Render Dashboard → Logs
       └─→ Check for errors
           └─→ Verify deployment success ✅
```

## 🎯 Key URLs Reference

| Component | URL Pattern | Example |
|-----------|-------------|---------|
| Frontend | `https://<name>.onrender.com` | `https://money-manager-frontend.onrender.com` |
| Backend | `https://<name>.onrender.com` | `https://money-manager-backend.onrender.com` |
| API Health | `https://<backend>/api/health` | `https://money-manager-backend.onrender.com/api/health` |
| MongoDB | `mongodb+srv://<cluster>` | `mongodb+srv://cluster.mongodb.net/money-manager` |

## 💡 Best Practices

1. **Environment Variables**: Never hardcode secrets
2. **CORS**: Configure properly for security
3. **Error Handling**: Implement comprehensive error handling
4. **Logging**: Use console.log for debugging in Render logs
5. **Health Checks**: Implement health endpoints for monitoring
6. **Database**: Use connection pooling and proper error handling
7. **Authentication**: Always verify JWT tokens on backend
8. **SPA Routing**: Use _redirects file for client-side routing

---

For detailed step-by-step instructions, see [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
