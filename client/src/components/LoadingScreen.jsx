import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.spinner}></div>
        <h2 className={styles.loadingText}>{message}</h2>
        <p className={styles.loadingSubtext}>Please wait while we prepare your dashboard...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
