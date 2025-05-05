import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./dashboard.module.css";
import PortfolioCard from './components/PortfolioCard';
import LeaderboardCard from './components/LeaderboardCard';
import PortfolioChartCard from './components/PortfolioChartCard';
import TopGainersCard from './components/TopGainersCard';

const Dashboard = () => {
    const [portfolioValue, setPortfolioValue] = useState(125670);
    const [portfolioDayChange, setPortfolioDayChange] = useState(3.2);

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
                        />
                        <LeaderboardCard />
                    </div>
                    <PortfolioChartCard />
                </div>
                <TopGainersCard />
            </div>
        </>
    );
};

export default Dashboard;