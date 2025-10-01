import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../api/api.js';
import styles from './StockChart.module.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StockChart = ({ ticker, stockName }) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('1m');

    const timePeriods = [
        { value: '1w', label: '1 Week' },
        { value: '1m', label: '1 Month' },
        { value: '6m', label: '6 Months' },
        { value: '1y', label: '1 Year' },
        { value: 'all', label: 'All Time' }
    ];

    useEffect(() => {
        if (ticker) {
            fetchChartData();
        }
    }, [ticker, selectedPeriod]);

    const fetchChartData = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await api.get('/api/stock-chart-data/', {
                params: {
                    ticker: ticker,
                    period: selectedPeriod
                }
            });

            const data = response.data.data;
            
            if (!data || data.length === 0) {
                setError('No historical data available for this stock');
                setChartData(null);
                return;
            }

            // Format data for Chart.js
            const labels = data.map(item => item.date);
            const prices = data.map(item => parseFloat(item.close));
            const totalChange = ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100;

            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Price',
                        data: prices,
                        borderColor: totalChange >= 0 ? '#10B981' : '#EF4444',
                        backgroundColor: totalChange >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.1,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: totalChange >= 0 ? '#10B981' : '#EF4444',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 2
                    }
                ]
            });

        } catch (error) {
            console.error('Error fetching chart data:', error);
            setError('Failed to load chart data');
            setChartData(null);
        } finally {
            setLoading(false);
        }
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#374151',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        const value = context.parsed.y;
                        return `$${value.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                display: true,
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 12
                    },
                    callback: function(value) {
                        return '$' + value.toFixed(2);
                    }
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    if (!ticker) {
        return (
            <div className={styles.chartContainer}>
                <div className={styles.noDataMessage}>
                    <p>Select a stock to view chart</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <div className={styles.chartTitle}>
                    <h3>{stockName || ticker} Price Chart</h3>
                </div>
                <div className={styles.periodSelector}>
                    {timePeriods.map(period => (
                        <button
                            key={period.value}
                            className={`${styles.periodButton} ${
                                selectedPeriod === period.value ? styles.active : ''
                            }`}
                            onClick={() => handlePeriodChange(period.value)}
                        >
                            {period.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.chartContent}>
                {loading && (
                    <div className={styles.loadingMessage}>
                        <div className={styles.spinner}></div>
                        <p>Loading chart data...</p>
                    </div>
                )}

                {error && (
                    <div className={styles.errorMessage}>
                        <p>{error}</p>
                        <button 
                            className={styles.retryButton}
                            onClick={fetchChartData}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {chartData && !loading && !error && (
                    <div className={styles.chartWrapper}>
                        <Line data={chartData} options={options} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StockChart;
