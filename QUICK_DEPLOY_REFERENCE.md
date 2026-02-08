# Quick Deployment Reference

## 🚀 Backend (Web Service)

### Configuration
```
Name: money-manager-backend
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/money-manager
JWT_SECRET=<generate-random-64-char-string>
FRONTEND_URL=https://your-frontend.onrender.com
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Test Endpoint
```
https://your-backend.onrender.com/api/health
```

---

## 🎨 Frontend (Static Site)

### Configuration
```
Name: money-manager-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### Environment Variables
```env
VITE_API_URL=https://your-backend.onrender.com
```

### Required Files
- `frontend/public/_redirects` (for SPA routing)

---

## 🗄️ MongoDB Atlas Setup

1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Network Access: `0.0.0.0/0`
4. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/money-manager?retryWrites=true&w=majority
   ```

---

## 📋 Deployment Order

1. **Setup MongoDB** → Get connection string
2. **Deploy Backend** → Get backend URL
3. **Deploy Frontend** → Use backend URL in env vars
4. **Update Backend** → Add frontend URL to CORS

---

## ⚡ Quick Commands

### Test Local Build
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm start
```

### Check Logs
- Render Dashboard → Select Service → Logs tab

---

## 🔗 Important Links

- [Render Dashboard](https://dashboard.render.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Full Deployment Guide](./RENDER_DEPLOYMENT_GUIDE.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

---

## ⚠️ Common Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check IP whitelist: `0.0.0.0/0` |
| CORS errors | Add `FRONTEND_URL` to backend env vars |
| 404 on refresh | Ensure `_redirects` file exists |
| Backend slow to respond | Free tier cold start (30-60s) |
| Build fails | Test `npm run build` locally |

---

## 📱 After Deployment

✅ Test user registration  
✅ Test user login  
✅ Create transactions  
✅ View dashboard  
✅ Test all features  

---

**Need detailed instructions?** See [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
