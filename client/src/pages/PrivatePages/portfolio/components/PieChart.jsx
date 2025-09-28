import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ stocks }) => {
    // Sort stocks by total value and get top 5
    const topStocks = [...stocks]
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5);

    // Calculate total value of top 5 stocks
    const totalValue = topStocks.reduce((sum, stock) => sum + stock.totalValue, 0);

    // Prepare data for Chart.js
    const data = {
        labels: topStocks.map(stock => stock.symbol),
        datasets: [
            {
                data: topStocks.map(stock => stock.totalValue),
                backgroundColor: [
                    '#4F46E5', 
                    '#7C3AED', 
                    '#EC4899', 
                    '#F59E0B', 
                    '#10B981', 
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.parsed;
                        const percentage = ((value / totalValue) * 100).toFixed(1);
                        return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937', textAlign: 'center' }}>
                Top 5 Stock Holdings
            </h3>
            <div style={{ flex: 1, height: '300px' }}>
                <Pie data={data} options={options} />
            </div>
        </div>
    );
};

export default PieChart;
