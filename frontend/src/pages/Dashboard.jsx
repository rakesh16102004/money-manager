import { useState, useEffect } from 'react';
import { dashboardAPI, transactionAPI, accountAPI } from '../services/api';
import StatBox from '../components/StatBox';
import Speedometer from '../components/Speedometer';
import Card from '../components/Card';
import Loading from '../components/Loading';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowRight,
    Calendar,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const Dashboard = () => {
    const [summary, setSummary] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Date range state
    const [dateRange, setDateRange] = useState('thisMonth');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    // Account selection state
    const [accounts, setAccounts] = useState([]);
    const [selectedAccountId, setSelectedAccountId] = useState('all');
    const [selectedAccountBalance, setSelectedAccountBalance] = useState(0);

    useEffect(() => {
        fetchAccounts();
        fetchDashboardData();
    }, [dateRange, customStartDate, customEndDate]);

    useEffect(() => {
        updateSelectedAccountBalance();
    }, [selectedAccountId, accounts]);

    const getDateRangeParams = () => {
        const now = new Date();
        let startDate, endDate;

        switch (dateRange) {
            case 'thisMonth':
                startDate = startOfMonth(now);
                endDate = endOfMonth(now);
                break;
            case 'lastMonth':
                const lastMonth = subMonths(now, 1);
                startDate = startOfMonth(lastMonth);
                endDate = endOfMonth(lastMonth);
                break;
            case 'last3Months':
                startDate = subMonths(now, 3);
                endDate = now;
                break;
            case 'custom':
                if (customStartDate && customEndDate) {
                    startDate = new Date(customStartDate);
                    endDate = new Date(customEndDate);
                }
                break;
            default:
                return {};
        }

        if (startDate && endDate) {
            return {
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
            };
        }
        return {};
    };

    const fetchAccounts = async () => {
        try {
            const response = await accountAPI.getAll();
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const updateSelectedAccountBalance = () => {
        if (selectedAccountId === 'all') {
            const total = accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
            setSelectedAccountBalance(total);
        } else {
            const account = accounts.find(acc => acc._id === selectedAccountId);
            setSelectedAccountBalance(account ? parseFloat(account.balance || 0) : 0);
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const dateParams = getDateRangeParams();

            const [summaryRes, monthlyRes, categoryRes, recentRes] = await Promise.all([
                dashboardAPI.getSummary(dateParams),
                dashboardAPI.getMonthly(dateParams),
                dashboardAPI.getCategories({ type: 'expense', ...dateParams }),
                dashboardAPI.getRecent(5, dateParams),
            ]);

            setSummary(summaryRes.data);
            setMonthlyData(monthlyRes.data);
            setCategoryData(categoryRes.data);
            setRecentTransactions(recentRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading fullScreen />;
    }

    const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Date Range Filter */}
            <Card>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <span className="font-medium text-gray-900 dark:text-white">Filter by Date:</span>
                    </div>

                    <div className="flex flex-wrap gap-3 flex-1">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="input w-auto min-w-[150px]"
                        >
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="last3Months">Last 3 Months</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        {dateRange === 'custom' && (
                            <>
                                <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) => setCustomStartDate(e.target.value)}
                                    className="input w-auto"
                                    placeholder="Start Date"
                                />
                                <span className="self-center text-gray-500">to</span>
                                <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) => setCustomEndDate(e.target.value)}
                                    className="input w-auto"
                                    placeholder="End Date"
                                />
                            </>
                        )}
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatBox
                    icon={TrendingUp}
                    label="Total Income"
                    value={`₹${summary?.income?.toLocaleString() || 0}`}
                    color="success"
                />
                <StatBox
                    icon={TrendingDown}
                    label="Total Expense"
                    value={`₹${summary?.expense?.toLocaleString() || 0}`}
                    color="danger"
                />
                <StatBox
                    icon={DollarSign}
                    label="Net Balance"
                    value={`₹${summary?.balance?.toLocaleString() || 0}`}
                    color="primary"
                />
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full -mr-12 -mt-12" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 dark:text-gray-400">Account Balance</p>
                                <select
                                    value={selectedAccountId}
                                    onChange={(e) => setSelectedAccountId(e.target.value)}
                                    className="text-sm font-medium bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                >
                                    <option value="all">All Accounts</option>
                                    {accounts.map((account) => (
                                        <option key={account._id} value={account._id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ₹{selectedAccountBalance.toLocaleString()}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Speedometer and Monthly Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Speedometer */}
                <Card className="flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Expense Monitor
                    </h3>
                    <Speedometer value={summary?.speedometerValue || 0} />
                </Card>

                {/* Monthly Chart */}
                <Card className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Monthly Income vs Expense
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            {/* Category Breakdown and Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Pie Chart */}
                <Card>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Expense by Category
                    </h3>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    dataKey="amount"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                            No expense data available
                        </div>
                    )}
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Recent Transactions
                        </h3>
                        <a
                            href="/transactions"
                            className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline flex items-center gap-1"
                        >
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="space-y-3">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((transaction) => (
                                <div
                                    key={transaction._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {transaction.category}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {transaction.description || 'No description'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-semibold ${transaction.type === 'income'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}₹
                                            {transaction.amount.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No transactions yet
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;

