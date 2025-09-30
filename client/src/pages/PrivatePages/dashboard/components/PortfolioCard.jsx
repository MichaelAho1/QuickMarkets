import React from 'react';
import { BsPiggyBank } from "react-icons/bs";
import styles from "./PortfolioCard.module.css";
import { Link } from 'react-router-dom';
import SmoothNumber from '../../../../components/SmoothNumber';

const PortfolioCard = ({ portfolioValue, portfolioDayChange, loading = false }) => {
    if (loading) {
        return (
            <div className={styles.portfolioCard}>
                <div className={styles.portfolioHeader}>
                    <BsPiggyBank />
                    <p className={styles.portfolioTitle}>Total Net Worth</p>
                </div>
                <div className={styles.valueLine}>
                    <h2 className={styles.portfolioValue}>Loading...</h2>
                    <h4 className={styles.loadingChange}>--</h4>
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
    }

    return (
        <div className={styles.portfolioCard}>
            <div className={styles.portfolioHeader}>
                <BsPiggyBank />
                <p className={styles.portfolioTitle}>Total Net Worth</p>
            </div>
            <div className={styles.valueLine}>
                <h2 className={styles.portfolioValue}>
                    <SmoothNumber 
                        value={portfolioValue} 
                        format="currency" 
                        decimals={0}
                    />
                </h2>
                <h4 className={portfolioDayChange >= 0 ? styles.positiveChange : styles.negativeChange}>
                    <SmoothNumber 
                        value={portfolioDayChange} 
                        format="percentage"
                        prefix={portfolioDayChange >= 0 ? '+' : ''}
                        decimals={2}
                    />
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