# 🚀 Quick Start Guide - Money Manager

## ⚡ Fast Setup (5 minutes)

### Step 1: MongoDB Setup

You have two options:

#### Option A: MongoDB Atlas (Recommended - Free Cloud Database)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (select FREE tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/money-manager?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB
1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The `.env` file is already configured for local MongoDB:
   ```
   MONGODB_URI=mongodb://localhost:27017/money-manager
   ```

### Step 2: Start Backend

```bash
cd backend
npm run dev
```

✅ Backend should be running on `http://localhost:5000`

### Step 3: Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

✅ Frontend should be running on `http://localhost:3000`

### Step 4: Open the App

Open your browser and go to: **http://localhost:3000**

---

## 📝 First Time Usage

1. **Register** a new account
2. **Create an account** (e.g., "Cash", "Bank")
3. **Add transactions** (income or expense)
4. **View dashboard** to see your analytics

---

## 🎯 Quick Commands

### Backend
```bash
cd backend
npm run dev      # Start development server
npm start        # Start production server
```

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🔧 Troubleshooting

### Backend won't start?
- ✅ Check MongoDB is running (Atlas or local)
- ✅ Verify `.env` file exists in `backend/` folder
- ✅ Check MongoDB connection string is correct

### Frontend won't start?
- ✅ Make sure backend is running first
- ✅ Check port 3000 is not in use
- ✅ Clear browser cache and try again

### Can't login?
- ✅ Make sure you registered first
- ✅ Check backend console for errors
- ✅ Verify MongoDB connection is working

---

## 📊 Test Data

To test the app quickly, create:

1. **Accounts:**
   - Cash
   - Bank Account
   - Credit Card

2. **Income Transactions:**
   - Salary - ₹50,000 (Office)
   - Freelance - ₹15,000 (Personal)

3. **Expense Transactions:**
   - Rent - ₹15,000 (Personal)
   - Groceries - ₹5,000 (Personal)
   - Office Supplies - ₹2,000 (Office)
   - Transportation - ₹3,000 (Personal)

4. **Transfer:**
   - Transfer ₹10,000 from Bank to Cash

---

## 🎨 Features to Try

- ✅ **Dashboard** - View your financial summary
- ✅ **Speedometer** - See your expense ratio
- ✅ **Charts** - Monthly trends and category breakdown
- ✅ **12-Hour Edit** - Edit transactions within 12 hours
- ✅ **Dark Mode** - Toggle theme with sun/moon icon
- ✅ **Filters** - Filter transactions by type, category, division
- ✅ **Reports** - View weekly, monthly, yearly trends

---

## 🌐 Default Credentials

There are no default credentials. You need to register a new account.

---

## 📱 Mobile Testing

The app is fully responsive. To test on mobile:

1. Find your computer's IP address
2. Update frontend to use IP instead of localhost
3. Access from mobile browser: `http://YOUR_IP:3000`

---

## 🚀 Production Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Deploy

---

## 💡 Tips

- Use **meaningful categories** for better analytics
- Separate **Office** and **Personal** expenses
- Create **multiple accounts** to track different sources
- Check the **speedometer** to monitor spending
- Use **Reports** to analyze trends

---

## 🆘 Need Help?

Check the main README.md for detailed documentation.

---

**Happy Money Managing! 💰**
