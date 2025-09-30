import React, { useState, useEffect } from 'react';
import { useStockData } from '../contexts/StockContext';
import styles from './SimulationTimer.module.css';

const SimulationTimer = () => {
    const { 
        refreshSimulationDay, 
        smoothRefreshAll,
        smoothRefreshStockData,
        smoothRefreshPortfolioData 
    } = useStockData();
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTimer = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/simulation-timer/');
            if (response.ok) {
                const data = await response.json();
                setTimeRemaining(data);
                
                // If a new day was triggered, refresh all data
                if (data.day_changed === false) {
                    console.log('New simulation day triggered! Refreshing all data...');
                    try {
                        // Refresh all data comprehensively
                        await Promise.all([
                            refreshSimulationDay(),
                            smoothRefreshAll()
                        ]);
                        console.log('All data refreshed successfully for new day');
                    } catch (error) {
                        console.error('Error refreshing data on day change:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching timer:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimer();
        
        // Update every second
        const interval = setInterval(fetchTimer, 1000);
        
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className={styles.timer}>Loading...</div>;
    }

    if (!timeRemaining) {
        return <div className={styles.timer}>--:--</div>;
    }

    return (
        <div className={styles.timer}>
            Next day in: {timeRemaining.formatted_time}
        </div>
    );
};

export default SimulationTimer;