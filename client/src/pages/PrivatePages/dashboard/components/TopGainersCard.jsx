import React, { useState, useEffect } from 'react';
import styles from "./TopGainersCard.module.css";
import SmoothNumber from '../../../../components/SmoothNumber';
import api from '../../../../api/api';

const TopGainersCard = ({ refreshKey = 0 }) => {
    const [activeTab, setActiveTab] = useState('gainers');
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTableData();
    }, [activeTab]);

    // Refresh data when refreshKey changes (every 5 minutes)
    useEffect(() => {
        if (refreshKey > 0) {
            loadTableData();
        }
    }, [refreshKey]);

    const loadTableData = async () => {
        try {
            setLoading(true);
            
            // Fetch stock data directly from API to avoid context refresh interference
            const response = await api.get('/api/view-stock-prices/');
            const stocks = response.data;
            
            // Calculate percentage change for each stock
            const stocksWithChange = stocks.map(stock => ({
                ...stock,
                percentageChange: ((stock.currPrice - stock.prevPrice) / stock.prevPrice) * 100
            }));

            // Sort by percentage change
            const sortedStocks = stocksWithChange.sort((a, b) => {
                if (activeTab === 'gainers') {
                    return b.percentageChange - a.percentageChange;
                } else {
                    return a.percentageChange - b.percentageChange;
                }
            });

            // Take top 5
            const topStocks = sortedStocks.slice(0, 5);
            
            const transformedData = topStocks.map(stock => ({
                name: stock.stockName,
                stock: stock.ticker,
                openingPrice: stock.prevPrice,
                currentPrice: stock.currPrice,
                oneWeekChange: stock.percentageChange,
                sector: stock.sectorType
            }));
            
            setTableData(transformedData);
        } catch (error) {
            console.error('Error loading table data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={styles.topGainersCard}>
            <div className={styles.cardHeader}>
                <div className={styles.headerContent}>
                    <h3>Top {activeTab === 'gainers' ? 'Gainers' : 'Losers'}</h3>
                    <p className={styles.headerDescription}>
                        {activeTab === 'gainers' 
                            ? 'Stocks with the highest growth this week' 
                            : 'Stocks with the lowest performance this week'
                        }
                    </p>
                </div>
                <div className={styles.tabButtons}>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'gainers' ? styles.activeTab : ''}`}
                        onClick={() => handleTabChange('gainers')}
                    >
                        Gainers
                    </button>
                    <button 
                        className={`${styles.tabButton} ${activeTab === 'losers' ? styles.activeTab : ''}`}
                        onClick={() => handleTabChange('losers')}
                    >
                        Losers
                    </button>
                </div>
            </div>
            <div className={styles.tableContainer}>
                {loading ? (
                    <div className={styles.loadingContainer}>
                        <p>Loading {activeTab}...</p>
                    </div>
                ) : (
                    <table className={styles.stocksTable}>
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Weekly Change</th>
                                <th>Sector</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.stock}</td>
                                    <td>{row.name}</td>
                                    <td>
                                        <SmoothNumber 
                                            value={row.currentPrice} 
                                            format="currency" 
                                            decimals={2}
                                        />
                                    </td>
                                    <td className={row.oneWeekChange >= 0 ? styles.positiveChange : styles.negativeChange}>
                                        <SmoothNumber 
                                            value={row.oneWeekChange} 
                                            format="percentage"
                                            prefix={row.oneWeekChange >= 0 ? '+' : ''}
                                            decimals={2}
                                        />
                                    </td>
                                    <td>{row.sector}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TopGainersCard;
