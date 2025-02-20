import React from 'react';
import styles from './header.module.css';

const header = () => {
    return (
        <div className={styles.header}>
            <h1 className={styles.title}>Stock Sim</h1>
            <div className={styles.headerInfo}>
                <h2 className={styles.value}>$10,000.00<br></br><span className={styles.description}>To Trade</span></h2>
            </div>
            <div className={styles.headerInfo}>
                <h2 className={styles.value}>$0.00<br></br><span className={styles.description}>Profit</span></h2>
            </div>
            <div className={styles.headerInfo}>
                <h2 className={styles.value}>$10,000.00<br></br><span className={styles.description}>To Trade</span></h2>
            </div>
            <div className={styles.headerInfo}>
                <h2 className={styles.value}>$0.00<br></br><span className={styles.description}>Invested</span></h2>
            </div>
        </div>
    );
};


export default header;