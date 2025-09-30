import React from 'react';
import PortfolioChart from '../../../../components/PortfolioChart';
import styles from "./PortfolioChartCard.module.css";

const PortfolioChartCard = ({ refreshKey }) => {
    return (
        <div className={styles.portfolioChartCard}>
            <PortfolioChart refreshKey={refreshKey} />
        </div>
    );
};

export default PortfolioChartCard; 