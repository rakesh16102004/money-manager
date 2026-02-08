# Money Manager - Frontend

Modern React frontend for the Money Manager application with beautiful UI and comprehensive features.

## Features

- 🎨 Beautiful glassmorphism design
- 🌓 Dark mode support
- 📊 Interactive charts and analytics
- 📱 Fully responsive
- ⚡ Fast and optimized with Vite
- 🎯 Type-safe with modern React patterns

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **react-d3-speedometer** - Speedometer gauge
- **React Router** - Routing
- **Axios** - API calls
- **Lucide React** - Icons
- **date-fns** - Date formatting

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the App

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Card.jsx
│   │   ├── StatBox.jsx
│   │   ├── Modal.jsx
│   │   ├── Speedometer.jsx
│   │   ├── Loading.jsx
│   │   └── Layout.jsx
│   ├── context/         # React context
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Accounts.jsx
│   │   └── Reports.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Key Features

### Dashboard
- Summary statistics (income, expense, balance)
- Speedometer gauge for expense monitoring
- Monthly income vs expense bar chart
- Category breakdown pie chart
- Recent transactions list

### Transactions
- Add/edit/delete transactions
- 12-hour edit window enforcement
- Filter by type, category, division
- Visual indicators for transaction type
- Account association

### Accounts
- Create multiple accounts
- View account balances
- Transfer money between accounts
- Beautiful card-based UI

### Reports
- Weekly/Monthly/Yearly views
- Income vs expense trends
- Net balance line chart
- Interactive charts with tooltips

## Design System

### Colors
- Primary: Blue gradient
- Success: Green
- Danger: Red
- Warning: Yellow
- Purple: Accent

### Components
All components use:
- Glassmorphism effects
- Smooth animations
- Hover effects
- Dark mode support
- Responsive design

### Animations
- Fade in
- Slide up/down
- Scale in
- Hover lift

## Dark Mode

Toggle dark mode using the sun/moon icon in the header. Dark mode preference is applied immediately using Tailwind's dark mode class.

## API Integration

The app communicates with the backend API using Axios. All API calls are centralized in `src/services/api.js` with automatic JWT token attachment.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Code splitting with React Router
- Lazy loading where applicable
- Optimized bundle size
- Fast page transitions

## License

MIT
