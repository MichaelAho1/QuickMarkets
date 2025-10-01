import React, { useState, useEffect } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./dashboard.module.css";
import PortfolioCard from './components/PortfolioCard';
import LeaderboardCard from './components/LeaderboardCard';
import PortfolioChartCard from './components/PortfolioChartCard';
import TopGainersCard from './components/TopGainersCard';
import NewsCard from './components/newsCard';
import { useStockData } from '../../../contexts/StockContext';
import RefreshIndicator from '../../../components/RefreshIndicator';
import api from '../../../api/api.js';

const Dashboard = () => {
    const { 
        portfolioLoading, 
        smoothRefreshAll,
        isRefreshing,
        getPortfolioSummary,
    } = useStockData();

    const [chartRefreshKey, setChartRefreshKey] = useState(0);
    const [topGainersRefreshKey, setTopGainersRefreshKey] = useState(0);
    const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
    const [previousDay, setPreviousDay] = useState(null);
    const [simulationTime, setSimulationTime] = useState({
        currentDay: 1,
        timeUntilNextDay: 15
    });

    // Fetch simulation time data
    const fetchSimulationTime = async () => {
        try {
            const response = await api.get('/api/simulation-time/');
            setSimulationTime({
                currentDay: response.data.current_day,
                timeUntilNextDay: response.data.time_until_next_day
            });
        } catch (error) {
            console.error('Error fetching simulation time:', error);
        }
    };

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

    // Fetch simulation time every 5 seconds
    useEffect(() => {
        // Fetch immediately on mount
        fetchSimulationTime();
        
        // Then fetch every 5 seconds
        const interval = setInterval(() => {
            fetchSimulationTime();
        }, 5000);

        return () => clearInterval(interval);
    }, []);


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
                            <h1>Day: {simulationTime.currentDay}</h1>
                            <h2>Time until Next day: {simulationTime.timeUntilNextDay} seconds</h2>
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