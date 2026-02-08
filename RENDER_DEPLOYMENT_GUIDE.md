# Render Deployment Guide - Money Manager App

This guide will walk you through deploying both the **frontend** (React + Vite) and **backend** (Node.js + Express + MongoDB) to Render.

---

## 📋 Prerequisites

Before you begin, make sure you have:

1. ✅ A [Render account](https://render.com/) (free tier works)
2. ✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. ✅ A MongoDB database (you can use MongoDB Atlas free tier or Render's managed MongoDB)

---

## 🗂️ Project Structure

Your project should have this structure:
```
money-manager/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── ... (other backend files)
└── frontend/
    ├── src/
    ├── package.json
    ├── vite.config.js
    └── ... (other frontend files)
```

---

## Part 1: Backend Deployment (Web Service)

### Step 1: Prepare Backend for Deployment

#### 1.1 Update `backend/package.json`

Ensure your start script is set correctly:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### 1.2 Create `backend/.env.example`

Create a template file to document required environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

#### 1.3 Verify CORS Configuration

Make sure your `backend/server.js` has proper CORS setup for production:
```javascript
// Option 1: Allow all origins (simplest for testing)
app.use(cors());

// Option 2: Specific origin (recommended for production)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend-app.onrender.com',
  credentials: true
}));
```

### Step 2: Deploy Backend on Render

1. **Login to Render Dashboard**
   - Go to [https://dashboard.render.com/](https://dashboard.render.com/)

2. **Create New Web Service**
   - Click **"New +"** → **"Web Service"**

3. **Connect Your Repository**
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Authorize Render to access your repositories
   - Select your `money-manager` repository

4. **Configure Web Service**
   - **Name**: `money-manager-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid plan)

5. **Add Environment Variables**
   
   Click **"Advanced"** → **"Add Environment Variable"** and add:
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` (Render will override this automatically) |
   | `MONGODB_URI` | Your MongoDB connection string |
   | `JWT_SECRET` | A strong random string (generate one) |
   | `FRONTEND_URL` | (Leave empty for now, update after frontend deployment) |

   **To generate JWT_SECRET**, run this in your terminal:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

6. **Create Web Service**
   - Click **"Create Web Service"**
   - Render will start building and deploying your backend
   - Wait for deployment to complete (usually 2-5 minutes)

7. **Note Your Backend URL**
   - Once deployed, you'll get a URL like: `https://money-manager-backend.onrender.com`
   - **Save this URL** - you'll need it for frontend configuration

8. **Test Your Backend**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - You should see: `{"status":"OK","timestamp":"..."}`

---

## Part 2: Frontend Deployment (Static Site)

### Step 1: Prepare Frontend for Deployment

#### 1.1 Create Environment Configuration

Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

**Replace** `your-backend-url.onrender.com` with your actual backend URL from Part 1.

#### 1.2 Update API Configuration

Make sure your frontend uses the environment variable for API calls.

Create or update `frontend/src/config/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
```

Then in your API calls (e.g., `frontend/src/services/api.js` or similar):
```javascript
import axios from 'axios';
import API_URL from '../config/api';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

#### 1.3 Verify Build Configuration

Check `frontend/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
```

#### 1.4 Test Local Build

Run a production build locally to ensure it works:
```bash
cd frontend
npm run build
npm run preview
```

### Step 2: Deploy Frontend on Render

1. **Create New Static Site**
   - In Render Dashboard, click **"New +"** → **"Static Site"**

2. **Connect Your Repository**
   - Select the same repository as before

3. **Configure Static Site**
   - **Name**: `money-manager-frontend` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variables**
   
   Click **"Advanced"** → **"Add Environment Variable"**:
   
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend-url.onrender.com` |

5. **Configure Redirects for SPA (Single Page Application)**
   
   Create `frontend/public/_redirects` file:
   ```
   /*    /index.html   200
   ```
   
   This ensures React Router works correctly with direct URL access.

6. **Create Static Site**
   - Click **"Create Static Site"**
   - Render will build and deploy your frontend
   - Wait for deployment (usually 2-5 minutes)

7. **Note Your Frontend URL**
   - You'll get a URL like: `https://money-manager-frontend.onrender.com`

---

## Part 3: Final Configuration

### Step 1: Update Backend CORS

Now that you have your frontend URL, update the backend:

1. Go to your backend service in Render Dashboard
2. Navigate to **"Environment"** tab
3. Add/Update environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-url.onrender.com`

4. If you configured specific CORS in your code, the backend will automatically redeploy

### Step 2: Update Backend Code (Optional but Recommended)

Update `backend/server.js` to use the environment variable:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

Commit and push this change to trigger a new deployment.

---

## 🧪 Testing Your Deployment

### Test Backend
1. Health check: `https://your-backend-url.onrender.com/api/health`
2. Try registering a user through your frontend
3. Check Render logs for any errors

### Test Frontend
1. Visit: `https://your-frontend-url.onrender.com`
2. Test user registration
3. Test user login
4. Test all features (transactions, accounts, dashboard)

---

## 📊 MongoDB Setup (If Not Already Done)

### Option 1: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs: `0.0.0.0/0` (for Render access)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/money-manager?retryWrites=true&w=majority`
6. Add this to your backend environment variables as `MONGODB_URI`

### Option 2: Render Managed MongoDB

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"** (they also offer MongoDB)
2. Follow the setup wizard
3. Copy the connection string
4. Add to backend environment variables

---

## 🔄 Continuous Deployment

Render automatically redeploys when you push to your connected branch:

1. Make changes to your code
2. Commit and push to GitHub/GitLab/Bitbucket
3. Render automatically detects changes and redeploys
4. Monitor deployment in Render Dashboard

---

## ⚠️ Important Notes

### Free Tier Limitations
- **Backend (Web Service)**: Spins down after 15 minutes of inactivity
  - First request after inactivity may take 30-60 seconds (cold start)
  - Consider upgrading to paid plan for production apps
  
- **Frontend (Static Site)**: Always available, no cold starts

### Environment Variables Security
- Never commit `.env` files to Git
- Always use Render's environment variable settings
- Rotate secrets regularly

### Database Connection
- Ensure MongoDB allows connections from all IPs (`0.0.0.0/0`)
- Or whitelist Render's IP ranges

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to MongoDB"
- **Solution**: Check MongoDB connection string, ensure IP whitelist includes `0.0.0.0/0`

**Problem**: "CORS errors"
- **Solution**: Verify `FRONTEND_URL` environment variable is set correctly

**Problem**: "Service won't start"
- **Solution**: Check Render logs, verify `package.json` start script

### Frontend Issues

**Problem**: "API calls failing"
- **Solution**: Verify `VITE_API_URL` is set correctly in environment variables

**Problem**: "404 on page refresh"
- **Solution**: Ensure `_redirects` file exists in `frontend/public/`

**Problem**: "Build fails"
- **Solution**: Test `npm run build` locally, check for errors

### Checking Logs

1. Go to Render Dashboard
2. Select your service
3. Click **"Logs"** tab
4. View real-time logs and errors

---

## 🚀 Custom Domains (Optional)

### Add Custom Domain to Frontend
1. Go to your static site settings
2. Click **"Custom Domains"**
3. Add your domain (e.g., `myapp.com`)
4. Update DNS records as instructed by Render
5. SSL certificate is automatically provisioned

### Add Custom Domain to Backend
1. Go to your web service settings
2. Click **"Custom Domains"**
3. Add subdomain (e.g., `api.myapp.com`)
4. Update DNS records
5. Update `VITE_API_URL` in frontend to use new domain

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] Code pushed to Git repository
- [ ] MongoDB database ready
- [ ] Environment variables documented
- [ ] Local build tested successfully

### Backend Deployment
- [ ] Web Service created on Render
- [ ] Environment variables configured
- [ ] Service deployed successfully
- [ ] Health check endpoint working
- [ ] Backend URL noted

### Frontend Deployment
- [ ] Static Site created on Render
- [ ] `VITE_API_URL` configured
- [ ] `_redirects` file created
- [ ] Build successful
- [ ] Frontend URL noted

### Post-Deployment
- [ ] Backend CORS updated with frontend URL
- [ ] Full application tested
- [ ] User registration/login working
- [ ] All features functional

---

## 🎉 You're Done!

Your Money Manager app is now live on Render!

- **Frontend**: `https://your-frontend-url.onrender.com`
- **Backend**: `https://your-backend-url.onrender.com`

Share your app with users and monitor it through the Render Dashboard.

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Deploying Node.js Apps](https://render.com/docs/deploy-node-express-app)
- [Deploying React Apps](https://render.com/docs/deploy-create-react-app)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Custom Domains](https://render.com/docs/custom-domains)

---

**Need Help?** Check Render's community forum or documentation for additional support.
