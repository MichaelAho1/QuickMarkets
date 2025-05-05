import React from 'react';
import styles from "./PortfolioChartCard.module.css";

const PortfolioChartCard = () => {
    return (
        <div className={styles.portfolioChartCard}>
            <div className={styles.cardHeader}>
                <h3>Portfolio Performance</h3>
            </div>
            <div className={styles.chartContent}>
                {/* Chart will be added here */}
            </div>
        </div>
    );
};

export default PortfolioChartCard; 