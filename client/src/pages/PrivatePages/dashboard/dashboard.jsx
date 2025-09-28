import React, { useState, useEffect } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./dashboard.module.css";
import PortfolioCard from './components/PortfolioCard';
import LeaderboardCard from './components/LeaderboardCard';
import PortfolioChartCard from './components/PortfolioChartCard';
import TopGainersCard from './components/TopGainersCard';
import NewsCard from './components/newsCard';
import { useStockData } from '../../../contexts/StockContext';

const Dashboard = () => {
    const { 
        portfolioLoading, 
        refreshPortfolioData,
        getPortfolioSummary
    } = useStockData();

    const handleTransactionComplete = () => {
        refreshPortfolioData();
    };

    // Get calculated portfolio summary
    const portfolioSummary = getPortfolioSummary();
    const totalNetWorth = portfolioSummary.totalNetWorth;
    const portfolioDayChange = portfolioSummary.portfolioDayChange;

    return (
        <>
            <Navbar />
            <div className={styles.dashboard}>
                <header>
                    <h1>Simulated Day 1</h1>
                    <h2>Time until Next day: 4 minutes 59 seconds </h2>
                </header>
                <div className={styles.mainSection}>
                    <div className={styles.leftColumn}>
                        <PortfolioCard 
                            portfolioValue={totalNetWorth}
                            portfolioDayChange={portfolioDayChange}
                            loading={portfolioLoading}
                        />
                        <LeaderboardCard />
                    </div>
                    <PortfolioChartCard />
                </div>
                <div className={styles.bottomSection}>
                    <TopGainersCard />
                    <NewsCard />
                </div>
            </div>
        </>
    );
};

export default Dashboard;