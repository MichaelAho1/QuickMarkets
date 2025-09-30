import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./dashboard.module.css";
import PortfolioCard from './components/PortfolioCard';
import LeaderboardCard from './components/LeaderboardCard';
import PortfolioChartCard from './components/PortfolioChartCard';
import TopGainersCard from './components/TopGainersCard';
import NewsCard from './components/newsCard';
import { useStockData } from '../../../contexts/StockContext';
import RefreshIndicator from '../../../components/RefreshIndicator';
import SimulationTimer from '../../../components/SimulationTimer';

const Dashboard = () => {
    const { 
        portfolioLoading, 
        smoothRefreshAll,
        isRefreshing,
        getPortfolioSummary,
        simulationDay,
        simulationDayLoading
    } = useStockData();

    const [chartRefreshKey, setChartRefreshKey] = useState(0);
    const [topGainersRefreshKey, setTopGainersRefreshKey] = useState(0);
    const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
    const [previousDay, setPreviousDay] = useState(null);

    // Auto-refresh portfolio and stock data every 5 seconds
    React.useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await smoothRefreshAll();
            } catch (error) {
                console.error('Error refreshing data:', error);
            }
        }, 5000); // Refresh every 5 seconds to catch simulation updates

        return () => clearInterval(interval);
    }, [smoothRefreshAll]);

    // Detect day changes and refresh dashboard components
    React.useEffect(() => {
        if (simulationDay && simulationDay.current_day !== previousDay) {
            console.log(`Day changed from ${previousDay} to ${simulationDay.current_day}. Refreshing dashboard components...`);
            setChartRefreshKey(prev => prev + 1);
            setTopGainersRefreshKey(prev => prev + 1);
            setLeaderboardRefreshKey(prev => prev + 1);
            setPreviousDay(simulationDay.current_day);
        }
    }, [simulationDay, previousDay]);

    // Initialize previous day when simulation day loads
    React.useEffect(() => {
        if (simulationDay && previousDay === null) {
            setPreviousDay(simulationDay.current_day);
        }
    }, [simulationDay, previousDay]);

    // Refresh chart, top gainers, and leaderboard every 5 minutes (300000ms) - fallback
    React.useEffect(() => {
        const interval = setInterval(() => {
            setChartRefreshKey(prev => prev + 1);
            setTopGainersRefreshKey(prev => prev + 1);
            setLeaderboardRefreshKey(prev => prev + 1);
        }, 300000); // Refresh every 5 minutes

        return () => clearInterval(interval);
    }, []);

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
                            <h1>
                                {simulationDayLoading ? 'Loading...' : 
                                 simulationDay ? `Simulated Day ${simulationDay.current_day}` : 
                                 'Simulated Day 1'}
                            </h1>
                            <SimulationTimer />
                        </div>
                        <RefreshIndicator isRefreshing={isRefreshing} size="small" />
                    </div>
                </header>
                <div className={styles.mainSection}>
                    <div className={styles.leftColumn}>
                        <PortfolioCard 
                            portfolioValue={totalNetWorth}
                            portfolioDayChange={portfolioDayChange}
                            loading={portfolioLoading}
                        />
                        <LeaderboardCard refreshKey={leaderboardRefreshKey} />
                    </div>
                    <PortfolioChartCard refreshKey={chartRefreshKey} />
                </div>
                <div className={styles.bottomSection}>
                    <TopGainersCard refreshKey={topGainersRefreshKey} />
                    <NewsCard />
                </div>
            </div>
        </>
    );
};

export default Dashboard;