import React, { useState, useEffect } from 'react';
import styles from "./LeaderboardCard.module.css";
import { useStockData } from '../../../../contexts/StockContext';

const LeaderboardCard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { getLeaderboard } = useStockData();

    useEffect(() => {
        fetchLeaderboardData();
    }, [getLeaderboard]);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getLeaderboard();
            setLeaderboardData(data);
        } catch (err) {
            setError('Failed to load leaderboard data');
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    if (loading) {
        return (
            <div className={styles.leaderboardCard}>
                <div className={styles.cardHeader}>
                    <h3>Leaderboard</h3>
                </div>
                <div className={styles.leaderboardContent}>
                    <div className={styles.loadingContainer}>
                        <p>Loading leaderboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.leaderboardCard}>
            <div className={styles.cardHeader}>
                <h3>Leaderboard</h3>
            </div>
            <div className={styles.leaderboardContent}>
                {leaderboardData.map((user, index) => (
                    <div 
                        key={user.username} 
                        className={styles.leaderboardItem}
                    >
                        <span className={styles.rank}>#{index + 1}</span>
                        <span className={styles.username}>{user.username}</span>
                        <span className={styles.score}>{formatCurrency(user.totalNetWorth)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardCard; 