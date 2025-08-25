import React, { useState, useEffect } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./dashboard.module.css";
import PortfolioCard from './components/PortfolioCard';
import LeaderboardCard from './components/LeaderboardCard';
import PortfolioChartCard from './components/PortfolioChartCard';
import TopGainersCard from './components/TopGainersCard';
import NewsCard from './components/newsCard';
import api from '../../../api/api.js';

const Dashboard = () => {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const [portfolioDayChange, setPortfolioDayChange] = useState(0);

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user-portfolio/');
            setPortfolioData(response.data);
            
            setPortfolioValue(response.data.summary.totalPortfolioValue);
            
            // This will/can be changed 
            const dayChange = response.data.summary.overallProfitLossPercent;
            setPortfolioDayChange(dayChange);
            
        } catch (err) {
            console.error('Error fetching portfolio data:', err);
            // Use default values if API fails
            setPortfolioValue(0);
            setPortfolioDayChange(0);
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionComplete = () => {
        fetchPortfolioData();
    };

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
                            portfolioValue={portfolioValue}
                            portfolioDayChange={portfolioDayChange}
                            loading={loading}
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