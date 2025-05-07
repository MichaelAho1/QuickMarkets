import React from 'react';
import styles from './DonutChart.module.css';

const DonutChart = ({ stocks }) => {
    // Sort stocks by total value and get top 5
    const topStocks = [...stocks]
        .sort((a, b) => b.totalValue - a.totalValue)
        .slice(0, 5);

    // Calculate total value of top 5 stocks
    const totalValue = topStocks.reduce((sum, stock) => sum + stock.totalValue, 0);

    // Calculate percentages and prepare data for the chart
    const chartData = topStocks.map(stock => ({
        ...stock,
        percentage: (stock.totalValue / totalValue) * 100
    }));

    // Generate colors for each segment
    const colors = [
        '#4F46E5', // Indigo
        '#7C3AED', // Violet
        '#EC4899', // Pink
        '#F59E0B', // Amber
        '#10B981', // Emerald
    ];

    return (
        <div className={styles.chartContainer}>
            <h3>Top 5 Holdings</h3>
            <div className={styles.chartContent}>
                <div className={styles.donutChart}>
                    {chartData.map((stock, index) => (
                        <div
                            key={stock.symbol}
                            className={styles.segment}
                            style={{
                                '--percentage': `${stock.percentage}%`,
                                '--color': colors[index],
                                '--start': `${index === 0 ? 0 : chartData.slice(0, index).reduce((sum, s) => sum + s.percentage, 0)}%`,
                                '--end': `${chartData.slice(0, index + 1).reduce((sum, s) => sum + s.percentage, 0)}%`
                            }}
                        />
                    ))}
                </div>
                <div className={styles.legend}>
                    {chartData.map((stock, index) => (
                        <div key={stock.symbol} className={styles.legendItem}>
                            <div 
                                className={styles.colorDot}
                                style={{ backgroundColor: colors[index] }}
                            />
                            <span className={styles.symbol}>{stock.symbol}</span>
                            <span className={styles.percentage}>{stock.percentage.toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonutChart; 