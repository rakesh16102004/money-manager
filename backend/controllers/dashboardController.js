import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';

// @desc    Get dashboard summary
// @route   GET /api/dashboard/summary
// @access  Private
export const getSummary = async (req, res) => {
    try {
        // Get total income and expense
        const stats = await Transaction.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const income = stats.find(s => s._id === 'income')?.total || 0;
        const expense = stats.find(s => s._id === 'expense')?.total || 0;
        const balance = income - expense;

        // Get total account balances
        const accounts = await Account.find({ userId: req.user._id });
        const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

        // Calculate speedometer value (expense percentage)
        const speedometerValue = income > 0 ? Math.round((expense / income) * 100) : 0;

        res.json({
            income,
            expense,
            balance,
            totalAccountBalance,
            speedometerValue,
            accountCount: accounts.length
        });
    } catch (error) {
        console.error('Get summary error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get monthly income vs expense
// @route   GET /api/dashboard/monthly
// @access  Private
export const getMonthlyData = async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const monthlyData = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: {
                        $gte: new Date(`${targetYear}-01-01`),
                        $lte: new Date(`${targetYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.month': 1 }
            }
        ]);

        // Format data for charts
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedData = months.map((month, index) => {
            const monthNum = index + 1;
            const income = monthlyData.find(d => d._id.month === monthNum && d._id.type === 'income')?.total || 0;
            const expense = monthlyData.find(d => d._id.month === monthNum && d._id.type === 'expense')?.total || 0;

            return {
                month,
                income,
                expense,
                net: income - expense
            };
        });

        res.json(formattedData);
    } catch (error) {
        console.error('Get monthly data error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get weekly trends
// @route   GET /api/dashboard/weekly
// @access  Private
export const getWeeklyData = async (req, res) => {
    try {
        const { weeks } = req.query;
        const weeksBack = weeks ? parseInt(weeks) : 12; // Default 12 weeks

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (weeksBack * 7));

        const weeklyData = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        week: { $week: '$date' },
                        year: { $year: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.week': 1 }
            }
        ]);

        // Group by week
        const weekMap = new Map();
        weeklyData.forEach(item => {
            const key = `${item._id.year}-W${item._id.week}`;
            if (!weekMap.has(key)) {
                weekMap.set(key, { week: key, income: 0, expense: 0 });
            }
            const week = weekMap.get(key);
            if (item._id.type === 'income') {
                week.income = item.total;
            } else {
                week.expense = item.total;
            }
        });

        const formattedData = Array.from(weekMap.values()).map(week => ({
            ...week,
            net: week.income - week.expense
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Get weekly data error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get yearly summary
// @route   GET /api/dashboard/yearly
// @access  Private
export const getYearlyData = async (req, res) => {
    try {
        const { years } = req.query;
        const yearsBack = years ? parseInt(years) : 5; // Default 5 years

        const currentYear = new Date().getFullYear();
        const startYear = currentYear - yearsBack + 1;

        const yearlyData = await Transaction.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    date: { $gte: new Date(`${startYear}-01-01`) }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            },
            {
                $sort: { '_id.year': 1 }
            }
        ]);

        // Format data
        const yearMap = new Map();
        yearlyData.forEach(item => {
            const year = item._id.year;
            if (!yearMap.has(year)) {
                yearMap.set(year, { year, income: 0, expense: 0 });
            }
            const yearData = yearMap.get(year);
            if (item._id.type === 'income') {
                yearData.income = item.total;
            } else {
                yearData.expense = item.total;
            }
        });

        const formattedData = Array.from(yearMap.values()).map(year => ({
            ...year,
            net: year.income - year.expense
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Get yearly data error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get category breakdown
// @route   GET /api/dashboard/categories
// @access  Private
export const getCategoryData = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;

        const matchStage = {
            userId: req.user._id
        };

        if (type) {
            matchStage.type = type;
        }

        if (startDate || endDate) {
            matchStage.date = {};
            if (startDate) matchStage.date.$gte = new Date(startDate);
            if (endDate) matchStage.date.$lte = new Date(endDate);
        }

        const categoryData = await Transaction.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        category: '$category',
                        type: '$type'
                    },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ]);

        // Format for pie chart
        const formattedData = categoryData.map(item => ({
            category: item._id.category,
            type: item._id.type,
            amount: item.total,
            count: item.count
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Get category data error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get division breakdown (Office vs Personal)
// @route   GET /api/dashboard/divisions
// @access  Private
export const getDivisionData = async (req, res) => {
    try {
        const divisionData = await Transaction.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: {
                        division: '$division',
                        type: '$type'
                    },
                    total: { $sum: '$amount' }
                }
            }
        ]);

        const formattedData = divisionData.map(item => ({
            division: item._id.division,
            type: item._id.type,
            amount: item.total
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Get division data error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get recent transactions
// @route   GET /api/dashboard/recent
// @access  Private
export const getRecentTransactions = async (req, res) => {
    try {
        const { limit } = req.query;
        const limitNum = limit ? parseInt(limit) : 10;

        const transactions = await Transaction.find({ userId: req.user._id })
            .populate('accountId', 'name')
            .sort({ createdAt: -1 })
            .limit(limitNum);

        res.json(transactions);
    } catch (error) {
        console.error('Get recent transactions error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};
