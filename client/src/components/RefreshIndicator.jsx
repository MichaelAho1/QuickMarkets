import React from 'react';
import styles from './RefreshIndicator.module.css';

const RefreshIndicator = ({ isRefreshing, size = 'small' }) => {
    return (
        <div className={`${styles.refreshIndicator} ${styles[size]} ${!isRefreshing ? styles.hidden : ''}`}>
            <div className={styles.spinner}></div>
            <span className={styles.text}>Updating...</span>
        </div>
    );
};

export default RefreshIndicator;
