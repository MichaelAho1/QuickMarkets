import React, { useState } from 'react';
import styles from "./TopGainersCard.module.css";

const TopGainersCard = () => {
    const [activeTab, setActiveTab] = useState('gainers');

    const tableData = [
        { name: 'Apple Inc.', stock: 'AAPL', price: 185.92, change: 2.5, sector: 'Technology' },
        { name: 'Microsoft Corp.', stock: 'MSFT', price: 415.32, change: 1.8, sector: 'Technology' },
        { name: 'Alphabet Inc.', stock: 'GOOGL', price: 142.65, change: 1.2, sector: 'Technology' },
        { name: 'NVIDIA Corp.', stock: 'NVDA', price: 875.42, change: 1.1, sector: 'Technology' },
        { name: 'Tesla Inc.', stock: 'TSLA', price: 178.75, change: 0.9, sector: 'Automotive' },
    ];

    return (
        <div className={styles.topGainersCard}>
            <div className={styles.cardHeader}>
                <div className={styles.headerContent}>
                    <h3>Top Gainers</h3>
                    <p className={styles.headerDescription}>Stocks with the highest potential for growth today</p>
                </div>
                <div className={styles.tabButtons}>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'gainers' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('gainers')}
                    >
                        Gainers
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'losers' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('losers')}
                    >
                        Losers
                    </button>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.stocksTable}>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>% Change</th>
                            <th>Sector</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.stock}</td>
                                <td>{row.name}</td>
                                <td>${row.price.toFixed(2)}</td>
                                <td className={row.change >= 0 ? styles.positiveChange : styles.negativeChange}>
                                    {row.change >= 0 ? '+' : ''}{row.change}%
                                </td>
                                <td>{row.sector}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopGainersCard;
