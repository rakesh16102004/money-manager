# Money Manager - Full Stack Application

A comprehensive money management application built with the MERN stack (MongoDB, Express, React, Node.js) for tracking income, expenses, and managing multiple accounts.

## 🚀 Features

### Core Functionality
- ✅ User authentication (JWT-based)
- ✅ Income & expense tracking
- ✅ Multiple account support
- ✅ Account-to-account transfers
- ✅ Category-based organization
- ✅ Office/Personal division
- ✅ 12-hour edit window for transactions
- ✅ Real-time balance updates

### Analytics & Reporting
- 📊 Dashboard with summary statistics
- 📈 Monthly/Weekly/Yearly trends
- 🥧 Category breakdown charts
- 🎯 Speedometer expense indicator
- 📉 Net balance tracking

### UI/UX
- 🎨 Beautiful glassmorphism design
- 🌓 Dark mode support
- 📱 Fully responsive
- ⚡ Smooth animations
- 🎯 Intuitive navigation

## 📁 Project Structure

```
money-manager/
├── backend/                 # Node.js + Express API
│   ├── controllers/        # Request handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── server.js          # Entry point
│
└── frontend/               # React + Vite app
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # React context
    │   ├── pages/         # Page components
    │   ├── services/      # API services
    │   └── App.jsx        # Main app
    └── index.html
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **react-d3-speedometer** - Gauge
- **React Router** - Routing
- **Axios** - HTTP client

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd money-manager
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# PORT=5000

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Start frontend dev server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🗄️ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Add a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string
7. Add it to `backend/.env`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/filter` - Filter transactions
- `PUT /api/transactions/:id` - Update transaction (12h window)
- `DELETE /api/transactions/:id` - Delete transaction

### Accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts` - Get all accounts
- `POST /api/accounts/transfer` - Transfer money
- `GET /api/accounts/transfers` - Get transfer history

### Dashboard
- `GET /api/dashboard/summary` - Get summary stats
- `GET /api/dashboard/monthly` - Get monthly data
- `GET /api/dashboard/weekly` - Get weekly data
- `GET /api/dashboard/yearly` - Get yearly data
- `GET /api/dashboard/categories` - Get category breakdown

## 🎯 Key Features Explained

### 12-Hour Edit Window
Transactions can only be edited within 12 hours of creation. This prevents accidental modifications to historical data while allowing quick corrections.

### Account Transfers
Money transfers between accounts use MongoDB transactions to ensure atomicity - either both accounts are updated or neither is.

### Speedometer Gauge
Visual indicator showing expense as a percentage of income:
- 🟢 Green (0-40%): Safe spending
- 🟡 Yellow (40-70%): Warning zone
- 🔴 Red (70-100%): Overspending

### Dashboard Analytics
Powered by MongoDB aggregation pipelines for efficient data processing:
- Real-time summary calculations
- Time-based trend analysis
- Category-wise breakdowns
- Division (Office/Personal) tracking

## 🎨 UI Components

- **Card** - Glassmorphism card with hover effects
- **StatBox** - Dashboard stat widget with icons
- **Modal** - Reusable modal with backdrop
- **Speedometer** - D3-based gauge component
- **Loading** - Spinner with size variants

## 🌓 Dark Mode

Toggle between light and dark themes using the sun/moon icon. Theme preference is applied using Tailwind's dark mode class.

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for stateless authentication
- Protected API routes
- Input validation on all endpoints
- MongoDB injection prevention

## 🚀 Deployment

### Render Deployment (Recommended)

This project includes comprehensive deployment guides for Render:

#### 📚 Deployment Documentation

1. **[Complete Deployment Guide](./RENDER_DEPLOYMENT_GUIDE.md)** - Step-by-step instructions for deploying both frontend and backend to Render
2. **[Quick Reference](./QUICK_DEPLOY_REFERENCE.md)** - Quick reference card with essential commands and configurations
3. **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Interactive checklist to ensure nothing is missed
4. **[Architecture Diagram](./DEPLOYMENT_ARCHITECTURE.md)** - Visual guide showing deployment structure and data flow
5. **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Solutions for common deployment issues

#### 🎯 Quick Start Deployment

**Backend (Web Service):**
```bash
# Configuration
Root Directory: backend
Build Command: npm install
Start Command: npm start

# Environment Variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<generate-random-string>
FRONTEND_URL=https://your-frontend.onrender.com
```

**Frontend (Static Site):**
```bash
# Configuration
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist

# Environment Variables
VITE_API_URL=https://your-backend.onrender.com
```

#### 📋 Deployment Steps Summary

1. **Setup MongoDB Atlas** - Create free cluster and get connection string
2. **Deploy Backend** - Create Web Service on Render with environment variables
3. **Deploy Frontend** - Create Static Site with backend URL
4. **Test Application** - Verify all features work in production

For detailed instructions, see **[RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)**

### Alternative Platforms

**Backend:** Railway, Heroku, DigitalOcean  
**Frontend:** Vercel, Netlify, Cloudflare Pages  
**Database:** MongoDB Atlas (recommended), Render Managed MongoDB

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ for hackathon MVP

---

**Happy Money Managing! 💰**
