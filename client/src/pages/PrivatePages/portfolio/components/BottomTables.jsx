import React, { useState, useEffect } from 'react';
import styles from './BottomTables.module.css';
import api from '../../../../api/api.js';

const BottomTables = ({ portfolioData }) => {
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    useEffect(() => {
        fetchTransactionHistory();
    }, []);

    const fetchTransactionHistory = async () => {
        try {
            setHistoryLoading(true);
            const response = await api.get('/api/transaction-history/');
            setTransactionHistory(response.data);
        } catch (err) {
            console.error('Error fetching transaction history:', err);
            setTransactionHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    // Calculate sector allocation from portfolio data
    const calculateSectorAllocation = () => {
        if (!portfolioData || !portfolioData.portfolio) {
            return [];
        }

        const sectorMap = {};
        let totalPortfolioValue = 0;

        // Group stocks by sector and calculate values
        portfolioData.portfolio.forEach(stock => {
            const sector = stock.sector || 'Unknown';
            const value = stock.totalValue || 0;
            
            if (!sectorMap[sector]) {
                sectorMap[sector] = {
                    name: sector,
                    value: 0,
                    stocks: []
                };
            }
            
            sectorMap[sector].value += value;
            sectorMap[sector].stocks.push(stock);
            totalPortfolioValue += value;
        });

        // Convert to array and calculate percentages
        const sectors = Object.values(sectorMap).map(sector => ({
            name: sector.name,
            value: sector.value,
            percentage: totalPortfolioValue > 0 ? (sector.value / totalPortfolioValue * 100) : 0
        }));

        // Sort by value (descending)
        return sectors.sort((a, b) => b.value - a.value);
    };

    const sectors = calculateSectorAllocation();

    return (
        <div className={styles.bottomSection}>
            <div className={styles.sectorCard}>
                <h3>Sectors Owned</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sector</th>
                                <th>Allocation</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sectors.map((sector, index) => (
                                    <tr key={index}>
                                        <td>{sector.name}</td>
                                        <td>
                                            <div className={styles.percentageBar}>
                                                <div 
                                                    className={styles.barFill} 
                                                    style={{ width: `${sector.percentage}%` }}
                                                ></div>
                                                <span>{sector.percentage.toFixed(1)}%</span>
                                            </div>
                                        </td>
                                        <td>${sector.value.toLocaleString()}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.historyCard}>
                <h3>Transaction History</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Value</th>
                                <th>Transaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyLoading ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : 
                                transactionHistory.map((transaction, index) => (
                                    <tr key={index}>
                                        <td>{transaction.date}</td>
                                        <td>${transaction.value.toLocaleString()}</td>
                                        <td className={transaction.change.startsWith('BUY') ? styles.positiveChange : styles.negativeChange}>
                                            {transaction.change}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BottomTables; 