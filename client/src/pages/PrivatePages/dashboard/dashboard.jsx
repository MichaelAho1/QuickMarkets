import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./dashboard.module.css";
import { BsPiggyBank } from "react-icons/bs";

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
                <section>
                    <div className={styles.portfolioCard}>
                        <BsPiggyBank />
                        <p className={styles.portfolioTitle}>Portfolio Value</p>
                        <div className={styles.valueLine}>
                            <h2 className={styles.portfolioValue}>${portfolioValue.toLocaleString()}</h2>
                            <h4 className={portfolioDayChange >= 0 ? styles.positiveChange : styles.negativeChange}>
                                {portfolioDayChange >= 0 ? '+' : ''}
                                {portfolioDayChange.toFixed(2)}% today
                            </h4>
                        </div>
                        <button>Sell Stocks</button>
                        <button>Buy Stocks</button>
                    </div>
                    <div className={styles.leaderboardCard}>

                    </div>
                    <div className={styles.portfolioChartCard}>

                    </div>
                </section>
            </div>
        </>
    );
};

export default Dashboard;