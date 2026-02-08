import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';
import { Calendar } from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const Reports = () => {
    const [period, setPeriod] = useState('monthly');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Date range state
    const [useCustomRange, setUseCustomRange] = useState(false);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    useEffect(() => {
        fetchData();
    }, [period, useCustomRange, customStartDate, customEndDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let response;
            if (period === 'weekly') {
                response = await dashboardAPI.getWeekly(12);
            } else if (period === 'monthly') {
                response = await dashboardAPI.getMonthly();
            } else {
                response = await dashboardAPI.getYearly(5);
            }
            setData(response.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header with Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reports
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Analyze your financial trends
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="input w-auto min-w-[150px]"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="customRange"
                            checked={useCustomRange}
                            onChange={(e) => setUseCustomRange(e.target.checked)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                        />
                        <label htmlFor="customRange" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Custom Range
                        </label>
                    </div>

                    {useCustomRange && (
                        <>
                            <input
                                type="date"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="input w-auto"
                                placeholder="Start Date"
                            />
                            <span className="text-gray-500">to</span>
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

            {loading ? (
                <Loading fullScreen />
            ) : (
                <>
                    {/* Bar Chart */}
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Income vs Expense - {period.charAt(0).toUpperCase() + period.slice(1)}
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis
                                    dataKey={period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year'}
                                />
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

                    {/* Line Chart */}
                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Net Balance Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                <XAxis
                                    dataKey={period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year'}
                                />
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
                                <Line
                                    type="monotone"
                                    dataKey="net"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    dot={{ fill: '#0ea5e9', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </>
            )}
        </div>
    );
};

export default Reports;
