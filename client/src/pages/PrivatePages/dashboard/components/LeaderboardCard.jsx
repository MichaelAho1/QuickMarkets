import React, { useState, useEffect } from 'react';
import styles from "./LeaderboardCard.module.css";
import SmoothNumber from '../../../../components/SmoothNumber';
import api from '../../../../api/api';

const LeaderboardCard = ({ refreshKey = 0 }) => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboardData();
    }, []);

    // Refresh data when refreshKey changes (every 5 minutes)
    useEffect(() => {
        if (refreshKey > 0) {
            fetchLeaderboardData();
        }
    }, [refreshKey]);

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch leaderboard data directly from API
            const response = await api.get('/api/leaderboard/');
            setLeaderboardData(response.data);
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
                        <span className={styles.score}>
                            <SmoothNumber 
                                value={user.totalNetWorth} 
                                format="currency" 
                                decimals={0}
                            />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaderboardCard; 