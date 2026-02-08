# Render Deployment Troubleshooting Guide

## 🐛 Common Issues & Solutions

---

## Backend Issues

### ❌ Issue: "Application failed to respond"

**Symptoms:**
- Backend service shows "Deploy failed" or "Application failed to respond"
- Service won't start

**Solutions:**

1. **Check Build Logs**
   ```
   Render Dashboard → Backend Service → Logs → Build Logs
   ```
   Look for npm install errors or missing dependencies

2. **Verify Start Command**
   - Should be: `npm start`
   - Check `package.json` has: `"start": "node server.js"`

3. **Check Environment Variables**
   - Ensure `MONGODB_URI` is set correctly
   - Verify `JWT_SECRET` is set
   - Check for typos in variable names

4. **Test Locally**
   ```bash
   cd backend
   npm install
   npm start
   ```

---

### ❌ Issue: "MongoDB connection error"

**Symptoms:**
- Logs show: "MongoDB connection error" or "MongoServerError"
- Backend starts but can't connect to database

**Solutions:**

1. **Check MongoDB URI**
   - Verify connection string format:
     ```
     mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
     ```
   - Ensure username and password are correct
   - Check database name is specified

2. **MongoDB Atlas Network Access**
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
   - This is required for Render to connect

3. **Database User Permissions**
   - Go to MongoDB Atlas → Database Access
   - Ensure user has "Read and write to any database" permissions

4. **Test Connection String**
   - Use MongoDB Compass or mongosh to test connection
   - If it works locally, issue is with Render access

---

### ❌ Issue: "CORS policy error"

**Symptoms:**
- Frontend shows: "Access to XMLHttpRequest blocked by CORS policy"
- API calls fail with CORS errors in browser console

**Solutions:**

1. **Update Backend CORS Configuration**
   
   In `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*',
     credentials: true
   }));
   ```

2. **Add FRONTEND_URL Environment Variable**
   - Render Dashboard → Backend Service → Environment
   - Add: `FRONTEND_URL` = `https://your-frontend.onrender.com`

3. **Allow All Origins (Testing Only)**
   ```javascript
   app.use(cors()); // Allows all origins
   ```

4. **Check API URL in Frontend**
   - Verify `VITE_API_URL` is set correctly
   - Should be: `https://your-backend.onrender.com`

---

### ❌ Issue: "JWT malformed" or "Invalid token"

**Symptoms:**
- Login works but subsequent requests fail
- Error: "jwt malformed" or "invalid token"

**Solutions:**

1. **Check JWT_SECRET**
   - Ensure `JWT_SECRET` is set in backend environment variables
   - Must be the same secret used to sign tokens

2. **Generate New Secret**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   - Add to Render environment variables

3. **Clear Frontend Storage**
   - Browser console: `localStorage.clear()`
   - Login again to get new token

---

## Frontend Issues

### ❌ Issue: "404 Not Found on page refresh"

**Symptoms:**
- App works when navigating within the app
- Refreshing page or direct URL access shows 404

**Solutions:**

1. **Create _redirects File**
   
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

2. **Verify File Location**
   - Must be in `frontend/public/` folder
   - Will be copied to `dist/` during build

3. **Rebuild and Redeploy**
   - Render Dashboard → Frontend Service → Manual Deploy → Deploy latest commit

---

### ❌ Issue: "API calls return 404"

**Symptoms:**
- Frontend loads but API calls fail
- Network tab shows 404 for API endpoints

**Solutions:**

1. **Check VITE_API_URL**
   - Render Dashboard → Frontend Service → Environment
   - Should be: `https://your-backend.onrender.com`
   - **No trailing slash!**

2. **Verify Backend is Running**
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should return: `{"status":"OK",...}`

3. **Check API Configuration**
   
   In `frontend/src/services/api.js`:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
   ```

4. **Rebuild Frontend**
   - Environment variables are embedded during build
   - Must rebuild after changing env vars

---

### ❌ Issue: "Build fails"

**Symptoms:**
- Frontend deployment fails during build
- Build logs show errors

**Solutions:**

1. **Test Build Locally**
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   - Fix any errors shown

2. **Check Build Command**
   - Should be: `npm install && npm run build`
   - Verify in Render settings

3. **Check Publish Directory**
   - Should be: `dist`
   - This is where Vite outputs build files

4. **Common Build Errors**
   - **Missing dependencies**: Add to `package.json`
   - **Import errors**: Check file paths and extensions
   - **Type errors**: Fix TypeScript/JSX errors

---

### ❌ Issue: "Environment variables not working"

**Symptoms:**
- `import.meta.env.VITE_API_URL` is undefined
- API calls go to wrong URL

**Solutions:**

1. **Check Variable Prefix**
   - Must start with `VITE_`
   - Example: `VITE_API_URL` ✅
   - Example: `API_URL` ❌

2. **Rebuild After Adding Variables**
   - Environment variables are embedded at build time
   - Render Dashboard → Manual Deploy → Deploy latest commit

3. **Check Variable Name**
   - Render Dashboard → Frontend Service → Environment
   - Verify exact spelling and case

---

## Database Issues

### ❌ Issue: "MongoServerError: bad auth"

**Symptoms:**
- Backend can't authenticate with MongoDB
- Error: "Authentication failed"

**Solutions:**

1. **Check Username and Password**
   - Verify credentials in connection string
   - Special characters must be URL-encoded
   - Example: `@` becomes `%40`, `#` becomes `%23`

2. **URL Encode Password**
   ```javascript
   const password = encodeURIComponent('your-password');
   const uri = `mongodb+srv://user:${password}@cluster.mongodb.net/db`;
   ```

3. **Recreate Database User**
   - MongoDB Atlas → Database Access
   - Delete and recreate user
   - Update connection string

---

### ❌ Issue: "Connection timeout"

**Symptoms:**
- Backend hangs when connecting to MongoDB
- Timeout after 30 seconds

**Solutions:**

1. **Check Network Access**
   - MongoDB Atlas → Network Access
   - Ensure `0.0.0.0/0` is in IP Access List

2. **Verify Cluster Status**
   - MongoDB Atlas → Database
   - Ensure cluster is running (not paused)

3. **Check Connection String Format**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```

---

## Performance Issues

### ❌ Issue: "Backend is very slow (30-60 seconds)"

**Symptoms:**
- First request after inactivity takes 30-60 seconds
- Subsequent requests are fast

**Cause:**
- **Free tier cold starts**: Render spins down services after 15 minutes of inactivity

**Solutions:**

1. **Upgrade to Paid Plan**
   - Paid plans don't spin down
   - Instant response times

2. **Keep-Alive Service (Workaround)**
   - Use external service to ping your backend every 10 minutes
   - Example: [UptimeRobot](https://uptimerobot.com/) (free)
   - Ping URL: `https://your-backend.onrender.com/api/health`

3. **Show Loading State**
   - Add loading indicator in frontend
   - Inform users of potential delay on first load

---

### ❌ Issue: "Database queries are slow"

**Symptoms:**
- API responses take several seconds
- Dashboard loads slowly

**Solutions:**

1. **Add Database Indexes**
   ```javascript
   // In your Mongoose schema
   userSchema.index({ email: 1 });
   transactionSchema.index({ userId: 1, date: -1 });
   ```

2. **Optimize Queries**
   - Use `.select()` to limit fields
   - Use `.lean()` for read-only queries
   - Implement pagination

3. **Check MongoDB Atlas Tier**
   - Free tier (M0) has limited resources
   - Consider upgrading for better performance

---

## Deployment Issues

### ❌ Issue: "Auto-deploy not working"

**Symptoms:**
- Push to Git but Render doesn't deploy
- No new deployment triggered

**Solutions:**

1. **Check Auto-Deploy Settings**
   - Render Dashboard → Service → Settings
   - Ensure "Auto-Deploy" is enabled

2. **Verify Branch**
   - Check you're pushing to the correct branch
   - Default is usually `main` or `master`

3. **Manual Deploy**
   - Render Dashboard → Service → Manual Deploy
   - Click "Deploy latest commit"

---

### ❌ Issue: "Old version still showing after deploy"

**Symptoms:**
- Deployed new code but changes not visible
- Old version still running

**Solutions:**

1. **Hard Refresh Browser**
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Clear Browser Cache**
   - Or use incognito/private mode

3. **Check Deployment Status**
   - Render Dashboard → Service → Events
   - Ensure deployment completed successfully

4. **Verify Build Output**
   - Check build logs for errors
   - Ensure build completed successfully

---

## Debugging Tips

### 📋 Check Render Logs

1. **Access Logs**
   ```
   Render Dashboard → Service → Logs
   ```

2. **Filter Logs**
   - Use search to find specific errors
   - Check timestamps to correlate with issues

3. **Add More Logging**
   ```javascript
   console.log('API Request:', req.method, req.path);
   console.log('User:', req.user);
   console.log('Response:', data);
   ```

### 🔍 Test API Endpoints

Use browser or tools like Postman:

```bash
# Health check
GET https://your-backend.onrender.com/api/health

# Test auth (should fail without token)
GET https://your-backend.onrender.com/api/dashboard/summary

# Test login
POST https://your-backend.onrender.com/api/auth/login
Body: { "email": "test@example.com", "password": "password" }
```

### 🌐 Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check:
   - Request URLs (correct backend URL?)
   - Status codes (200, 401, 404, 500?)
   - Response data (errors?)
   - Request headers (token included?)

### 📊 Monitor Service Health

1. **Render Dashboard Metrics**
   - CPU usage
   - Memory usage
   - Response times

2. **Set Up Alerts**
   - Render can notify you of deployment failures
   - Configure in service settings

---

## Emergency Fixes

### 🚨 Service is Down - Quick Fix

1. **Check Service Status**
   - Render Dashboard → Service status indicator

2. **Restart Service**
   - Render Dashboard → Service → Manual Deploy
   - Or: Settings → Suspend → Resume

3. **Rollback to Previous Version**
   - Render Dashboard → Service → Events
   - Find last working deployment
   - Click "Rollback to this version"

4. **Check Recent Changes**
   - Review recent commits
   - Revert problematic changes
   - Push fix to Git

---

## Getting Help

### 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

### 💬 Support Channels

- **Render Support**: support@render.com
- **Community Forum**: [community.render.com](https://community.render.com/)
- **Status Page**: [status.render.com](https://status.render.com/)

### 🔧 Before Asking for Help

Provide this information:

1. Service name and URL
2. Error message (exact text)
3. When the issue started
4. What you've tried
5. Relevant logs (from Render Dashboard)
6. Steps to reproduce

---

## Preventive Measures

### ✅ Best Practices

1. **Test Locally First**
   - Always test builds locally before deploying
   - Run `npm run build` and `npm run preview`

2. **Use Environment Variables**
   - Never hardcode secrets
   - Use `.env.example` to document required vars

3. **Monitor Deployments**
   - Watch deployment logs
   - Verify deployment success before closing

4. **Keep Dependencies Updated**
   - Regularly update npm packages
   - Test after updates

5. **Implement Error Handling**
   - Catch and log errors
   - Provide meaningful error messages

6. **Use Version Control**
   - Commit working code
   - Tag releases
   - Easy to rollback if needed

---

**Still having issues?** Check the [full deployment guide](./RENDER_DEPLOYMENT_GUIDE.md) or [architecture diagram](./DEPLOYMENT_ARCHITECTURE.md).
