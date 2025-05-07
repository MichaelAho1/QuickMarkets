import React from 'react';
import { BsPiggyBank } from "react-icons/bs";
import styles from "./PortfolioCard.module.css";
import { Link } from 'react-router-dom';

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
                <Link to="/admin/exploreStocks" className={styles.actionButton}>
                    Buy Stocks
                </Link>
                <Link to="/admin/Portfolio" className={styles.actionButton}>
                    Sell Stocks
                </Link>
            </div>
        </div>
    );
};

export default PortfolioCard; 