import React from 'react';
import styles from "./LeaderboardCard.module.css";

const LeaderboardCard = () => {
    return (
        <div className={styles.leaderboardCard}>
            <div className={styles.cardHeader}>
                <h3>Leaderboard</h3>
            </div>
            <div className={styles.leaderboardContent}>
                <div className={styles.leaderboardItem}>
                    <span className={styles.rank}>1</span>
                    <span className={styles.username}>John Doe</span>
                    <span className={styles.score}>$150,000</span>
                </div>
                <div className={styles.leaderboardItem}>
                    <span className={styles.rank}>2</span>
                    <span className={styles.username}>Jane Smith</span>
                    <span className={styles.score}>$145,000</span>
                </div>
                <div className={styles.leaderboardItem}>
                    <span className={styles.rank}>3</span>
                    <span className={styles.username}>Mike Johnson</span>
                    <span className={styles.score}>$140,000</span>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardCard; 