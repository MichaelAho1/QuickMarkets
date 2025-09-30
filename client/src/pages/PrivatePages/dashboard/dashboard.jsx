import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./dashboard.module.css";
import PortfolioCard from './components/PortfolioCard';
import LeaderboardCard from './components/LeaderboardCard';
import PortfolioChartCard from './components/PortfolioChartCard';
import TopGainersCard from './components/TopGainersCard';
import NewsCard from './components/newsCard';
import { useStockData } from '../../../contexts/StockContext';
import api from '../../../api/api';

const Dashboard = () => {
    const { 
        portfolioLoading, 
        refreshPortfolioData,
        refreshStockData,
        getPortfolioSummary
    } = useStockData();

    const [chartRefreshKey, setChartRefreshKey] = useState(0);
    const [simulationStatus, setSimulationStatus] = useState({
        isRunning: true,
        nextStartOfDay: null,
        nextDuringDay: null
    });

    // Auto-refresh data every 3 seconds to match simulation frequency
    React.useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await Promise.all([
                    refreshStockData(),
                    refreshPortfolioData()
                ]);
                setChartRefreshKey(prev => prev + 1);
            } catch (error) {
                console.error('Error refreshing data:', error);
            }
        }, 5000); // Refresh every 3 seconds to catch simulation updates

        return () => clearInterval(interval);
    }, [refreshStockData, refreshPortfolioData]);

    // Get calculated portfolio summary
    const portfolioSummary = getPortfolioSummary();
    const totalNetWorth = portfolioSummary.totalNetWorth;
    const portfolioDayChange = portfolioSummary.portfolioDayChange;

    return (
        <>
            <Navbar />
            <div className={styles.dashboard}>
                <header>
                    <div className={styles.headerTop}>
                        <div>
                            <h1>Simulated Day 1</h1>
                            <h2>Time until Next day: 4 minutes 59 seconds </h2>
                        </div>
                    </div>
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
                    <PortfolioChartCard refreshKey={chartRefreshKey} />
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