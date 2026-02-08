import { TrendingUp, TrendingDown } from 'lucide-react';

const StatBox = ({ icon: Icon, label, value, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
        primary: 'from-blue-500 to-blue-600',
        success: 'from-green-500 to-green-600',
        danger: 'from-red-500 to-red-600',
        warning: 'from-yellow-500 to-yellow-600',
        purple: 'from-purple-500 to-purple-600',
    };

    return (
        <div className="card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {label}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {value}
                    </h3>
                    {trend && (
                        <div className="flex items-center gap-1">
                            {trend === 'up' ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                            <span
                                className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                {trendValue}
                            </span>
                        </div>
                    )}
                </div>
                <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatBox;
