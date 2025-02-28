import React from 'react';
import styles from './marketSection.module.css';

const MarketSection = () => {
    const stockData = [
        { symbol: 'Top50', type: 'Index Fund', volatility: 'Low', dayChange: '+1.25%', priceChange: '+$122.01', price: '$7,352.05', action: 'Buy' },
        { symbol: 'TopTech10', type: 'Index Fund', volatility: 'Low', dayChange: '+1.55%', priceChange: '+$122.01', price: '$2,532.01', action: 'Buy' },
        { symbol: 'GOOG', type: 'Tech', volatility: 'Medium', dayChange: '+2.45%', priceChange: '+$22.01', price: '$172.05', action: 'Buy' },
        { symbol: 'NVIDIA', type: 'Tech', volatility: 'Medium', dayChange: '-1.34%', priceChange: '-$2.32', price: '$123.64', action: 'Buy' },
        { symbol: 'COSTCO', type: 'Retail', volatility: 'Low', dayChange: '+0.45%', priceChange: '+$4.32', price: '$954.72', action: 'Buy' },
        { symbol: 'OKLO', type: 'Retail', volatility: 'High', dayChange: '+7.45%', priceChange: '+$3.43', price: '$52.62', action: 'Buy' },
        { symbol: 'TOST', type: 'Tech', volatility: 'Medium', dayChange: '-0.34%', priceChange: '-$1.11', price: '$40.49', action: 'Buy' },
    ];

    return (
        <div className={styles.marketContainer}>
            <div className={styles.header}>
                <div className={styles.searchSection}>
                    <div className={styles.searchBar}>
                        <input type="text" placeholder="Search" />
                        <button className={styles.filterButton}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 18v-2h6v2H3zm0-5v-2h12v2H3zm0-5V6h18v2H3z"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={styles.centerTitle}>
                    <h2>Stocks</h2>
                    <span className={styles.date}>February 15</span>
                </div>

                <div className={styles.title}>
                    <h2>Total Market</h2>
                    <span className={styles.positive}>+10.55% | +$782.54</span>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Type</th>
                            <th>Volatility</th>
                            <th>Day Change</th>
                            <th>Index Fund</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockData.map((stock, index) => (
                            <tr key={index}>
                                <td>{stock.symbol}</td>
                                <td>{stock.type}</td>
                                <td className={styles[stock.volatility.toLowerCase()]}>{stock.volatility}</td>
                                <td className={stock.dayChange.startsWith('+') ? styles.positive : styles.negative}>
                                    {stock.dayChange} | {stock.priceChange}
                                </td>
                                <td>{stock.price}</td>
                                <td>
                                    <button className={styles.buyButton}>Buy</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MarketSection;