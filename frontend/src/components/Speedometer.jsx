import ReactSpeedometer from 'react-d3-speedometer';
import { useEffect, useState } from 'react';

const Speedometer = ({ value, maxValue = 100 }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check if dark mode is enabled
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };

        checkDarkMode();

        // Watch for theme changes
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    const getSegmentColors = () => {
        return [
            '#10b981', // Green (0-40%)
            '#10b981', // Green
            '#f59e0b', // Yellow (40-70%)
            '#f59e0b', // Yellow
            '#ef4444', // Red (70-100%)
            '#ef4444', // Red
        ];
    };

    const getLabel = () => {
        if (value <= 40) return 'Safe';
        if (value <= 70) return 'Warning';
        return 'Overspending';
    };

    const getLabelColor = () => {
        if (value <= 40) return '#10b981';
        if (value <= 70) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="flex flex-col items-center">
            <ReactSpeedometer
                value={value}
                minValue={0}
                maxValue={maxValue}
                segments={6}
                segmentColors={getSegmentColors()}
                needleColor={isDark ? '#94a3b8' : '#475569'}
                needleTransitionDuration={1000}
                needleTransition="easeElastic"
                currentValueText={`${value}%`}
                textColor={isDark ? '#f1f5f9' : '#0f172a'}
                valueTextFontSize="24px"
                labelFontSize="14px"
                width={300}
                height={200}
                ringWidth={30}
                needleHeightRatio={0.7}
            />
            <div className="mt-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Expense Status
                </p>
                <p
                    className="text-xl font-bold mt-1"
                    style={{ color: getLabelColor() }}
                >
                    {getLabel()}
                </p>
            </div>
        </div>
    );
};

export default Speedometer;
