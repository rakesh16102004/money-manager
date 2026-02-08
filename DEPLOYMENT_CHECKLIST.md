# Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## ✅ Pre-Deployment

- [ ] All code committed and pushed to Git repository (GitHub/GitLab/Bitbucket)
- [ ] MongoDB database ready (MongoDB Atlas or Render managed)
- [ ] `.env.example` file exists in backend folder
- [ ] `_redirects` file exists in `frontend/public/` folder
- [ ] Test local build: `cd frontend && npm run build`
- [ ] Verify backend starts: `cd backend && npm start`

## ✅ Backend Deployment (Web Service)

### 1. Create Web Service
- [ ] Login to [Render Dashboard](https://dashboard.render.com/)
- [ ] Click "New +" → "Web Service"
- [ ] Connect your Git repository
- [ ] Select repository: `money-manager`

### 2. Configure Service
- [ ] **Name**: `money-manager-backend`
- [ ] **Region**: (Choose closest to users)
- [ ] **Branch**: `main`
- [ ] **Root Directory**: `backend`
- [ ] **Environment**: `Node`
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Plan**: Free (or paid)

### 3. Environment Variables
Add these in "Advanced" → "Add Environment Variable":

- [ ] `NODE_ENV` = `production`
- [ ] `MONGODB_URI` = `mongodb+srv://...` (your connection string)
- [ ] `JWT_SECRET` = (generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- [ ] `PORT` = `5000` (optional, Render auto-assigns)

### 4. Deploy & Test
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-5 minutes)
- [ ] **Copy Backend URL**: `https://money-manager-backend-xxxx.onrender.com`
- [ ] Test health endpoint: `https://your-backend-url.onrender.com/api/health`
- [ ] Should return: `{"status":"OK","timestamp":"..."}`

## ✅ Frontend Deployment (Static Site)

### 1. Create Static Site
- [ ] In Render Dashboard, click "New +" → "Static Site"
- [ ] Select same repository

### 2. Configure Site
- [ ] **Name**: `money-manager-frontend`
- [ ] **Branch**: `main`
- [ ] **Root Directory**: `frontend`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Publish Directory**: `dist`

### 3. Environment Variables
Add in "Advanced" → "Add Environment Variable":

- [ ] `VITE_API_URL` = `https://your-backend-url.onrender.com` (from backend deployment)

### 4. Deploy & Test
- [ ] Click "Create Static Site"
- [ ] Wait for deployment (2-5 minutes)
- [ ] **Copy Frontend URL**: `https://money-manager-frontend-xxxx.onrender.com`
- [ ] Visit frontend URL and test the app

## ✅ Post-Deployment Configuration

### Update Backend CORS (Optional)
- [ ] Go to backend service in Render Dashboard
- [ ] Navigate to "Environment" tab
- [ ] Add variable: `FRONTEND_URL` = `https://your-frontend-url.onrender.com`
- [ ] Service will auto-redeploy

### Full Application Testing
- [ ] Visit frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Create a transaction
- [ ] Create an account
- [ ] View dashboard
- [ ] Check all features work

## ✅ MongoDB Setup (If Not Done)

### MongoDB Atlas
- [ ] Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Create free cluster
- [ ] Create database user
- [ ] Network Access: Add IP `0.0.0.0/0` (allow all)
- [ ] Get connection string
- [ ] Add to backend environment variables as `MONGODB_URI`

## 🎯 Final URLs

Record your deployment URLs here:

- **Backend**: `https://_____________________________.onrender.com`
- **Frontend**: `https://_____________________________.onrender.com`
- **MongoDB**: `mongodb+srv://_____________________________`

## 🐛 Troubleshooting

### Backend won't start?
- [ ] Check Render logs (Dashboard → Service → Logs)
- [ ] Verify MongoDB connection string
- [ ] Ensure MongoDB allows connections from `0.0.0.0/0`

### Frontend API calls failing?
- [ ] Verify `VITE_API_URL` is set correctly
- [ ] Check backend is running (visit health endpoint)
- [ ] Check browser console for CORS errors

### 404 on page refresh?
- [ ] Ensure `_redirects` file exists in `frontend/public/`
- [ ] Content should be: `/*    /index.html   200`

### Build fails?
- [ ] Test locally: `npm run build`
- [ ] Check Render build logs
- [ ] Verify all dependencies in `package.json`

## 📝 Important Notes

### Free Tier Limitations
- **Backend**: Spins down after 15 min inactivity (30-60s cold start)
- **Frontend**: Always available

### Security
- Never commit `.env` files
- Use Render's environment variables
- Rotate secrets regularly

## 🚀 Continuous Deployment

Once set up, deployments are automatic:
1. Make code changes
2. Commit and push to Git
3. Render auto-detects and redeploys
4. Monitor in Dashboard

## ✅ Deployment Complete!

Congratulations! Your Money Manager app is now live on Render! 🎉

Share your app: `https://your-frontend-url.onrender.com`
