import React from 'react';
import styles from './header.module.css';

const header = () => {
    return (
        <div className={styles.header}>
            <h1>Stock Sim</h1>
            <div className={styles.headerInfo}>
                <h2 className={styles.toTrade}>$10,000.00</h2>
                <h3>To Trade</h3>
            </div>
            <div className={styles.headerInfo}>
                <h2 className={styles.toTrade}>$0.00</h2>
                <h3>Profit</h3>
            </div>
            <div className={styles.headerInfo}>
                <h2 className={styles.toTrade}>$10,000.00</h2>
                <h3>Net Worth</h3>
            </div>
            <div className={styles.headerInfo}>
                <h2 className={styles.toTrade}>$10,000.00</h2>
                <h3>Invested</h3>
            </div>
        </div>
    );
};

export default header;