# Money Manager - Backend API

Backend API for the Money Manager application built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT Authentication
- 💰 Transaction Management (Income/Expense)
- 🏦 Multiple Account Support
- 💸 Account Transfers
- 📊 Dashboard Analytics
- ⏰ 12-Hour Edit Window for Transactions
- 🔄 Real-time Balance Updates

## Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/filter` - Filter transactions
- `GET /api/transactions/categories` - Get all categories
- `PUT /api/transactions/:id` - Update transaction (12-hour window)
- `DELETE /api/transactions/:id` - Delete transaction

### Accounts
- `POST /api/accounts` - Create account
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get single account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account
- `POST /api/accounts/transfer` - Transfer between accounts
- `GET /api/accounts/transfers` - Get transfer history

### Dashboard
- `GET /api/dashboard/summary` - Get summary stats
- `GET /api/dashboard/monthly` - Get monthly data
- `GET /api/dashboard/weekly` - Get weekly trends
- `GET /api/dashboard/yearly` - Get yearly summary
- `GET /api/dashboard/categories` - Get category breakdown
- `GET /api/dashboard/divisions` - Get office/personal breakdown
- `GET /api/dashboard/recent` - Get recent transactions

## Project Structure

```
backend/
├── controllers/        # Request handlers
├── models/            # MongoDB schemas
├── routes/            # API routes
├── middleware/        # Custom middleware
├── server.js          # Entry point
└── package.json       # Dependencies
```

## Key Features

### 12-Hour Edit Window
Transactions can only be edited within 12 hours of creation. This is enforced through:
- Virtual property `isEditable` on Transaction model
- Backend validation in update controller
- Automatic balance recalculation on edit

### Account Transfers
Transfers use MongoDB transactions to ensure atomicity:
- Deduct from source account
- Add to destination account
- Create transfer record
- All or nothing operation

### Dashboard Analytics
Powered by MongoDB aggregation pipelines:
- Monthly income vs expense trends
- Weekly spending patterns
- Category-wise breakdown
- Speedometer calculation (expense/income ratio)

## MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Add database user
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string and add to `.env`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/db |
| JWT_SECRET | Secret key for JWT | your_super_secret_key |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development/production |

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message here"
}
```

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Protected routes with auth middleware
- Input validation on all endpoints
- MongoDB injection prevention

## License

MIT
