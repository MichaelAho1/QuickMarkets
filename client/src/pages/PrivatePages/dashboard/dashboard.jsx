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

    const [simulationLoading, setSimulationLoading] = useState(false);
    const [chartRefreshKey, setChartRefreshKey] = useState(0);


    const handleStartOfDaySimulation = async () => {
        setSimulationLoading(true);
        try {
            // First run end of day simulation to store previous day's data
            await api.post('/api/simulate-end-of-day/');
            await api.post('/api/simulate-start-of-day/');
            // Refresh both stock data and portfolio data to show updated prices
            await Promise.all([
                refreshStockData(),
                refreshPortfolioData()
            ]);
            // Trigger chart refresh
            setChartRefreshKey(prev => prev + 1);
        } catch (error) {
            console.error('Error running start of day simulation:', error);
            alert('Error running start of day simulation. Please try again.');
        } finally {
            setSimulationLoading(false);
        }
    };

    const handleDuringDaySimulation = async () => {
        setSimulationLoading(true);
        try {
            await api.post('/api/simulate-during-day/');
            alert('During day simulation completed successfully!');
            // Refresh both stock data and portfolio data to show updated prices
            await Promise.all([
                refreshStockData(),
                refreshPortfolioData()
            ]);
        } catch (error) {
            console.error('Error running during day simulation:', error);
            alert('Error running during day simulation. Please try again.');
        } finally {
            setSimulationLoading(false);
        }
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
                    <div className={styles.headerTop}>
                        <div>
                            <h1>Simulated Day 1</h1>
                            <h2>Time until Next day: 4 minutes 59 seconds </h2>
                        </div>
                        <div className={styles.simulationButtons}>
                            <button 
                                className={styles.simButton}
                                onClick={handleStartOfDaySimulation}
                                disabled={simulationLoading}
                            >
                                {simulationLoading ? 'Running...' : 'Simulate Start of Day'}
                            </button>
                            <button 
                                className={styles.simButton}
                                onClick={handleDuringDaySimulation}
                                disabled={simulationLoading}
                            >
                                {simulationLoading ? 'Running...' : 'Simulate During Day'}
                            </button>
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