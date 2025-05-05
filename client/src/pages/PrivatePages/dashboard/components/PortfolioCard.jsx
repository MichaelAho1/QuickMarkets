import React from 'react';
import { BsPiggyBank } from "react-icons/bs";
import styles from "./PortfolioCard.module.css";

const PortfolioCard = ({ portfolioValue, portfolioDayChange }) => {
    return (
        <div className={styles.portfolioCard}>
            <div className={styles.portfolioHeader}>
                <BsPiggyBank />
                <p className={styles.portfolioTitle}>Portfolio Value</p>
            </div>
            <div className={styles.valueLine}>
                <h2 className={styles.portfolioValue}>${portfolioValue.toLocaleString()}</h2>
                <h4 className={portfolioDayChange >= 0 ? styles.positiveChange : styles.negativeChange}>
                    {portfolioDayChange >= 0 ? '+' : ''}
                    {portfolioDayChange.toFixed(2)}%
                </h4>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.actionButton}>Sell Stocks</button>
                <button className={styles.actionButton}>Buy Stocks</button>
            </div>
        </div>
    );
};

export default PortfolioCard; 