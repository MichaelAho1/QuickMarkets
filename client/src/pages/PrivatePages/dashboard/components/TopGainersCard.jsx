import React, { useState, useEffect } from 'react';
import styles from "./TopGainersCard.module.css";
import { useStockData } from '../../../../contexts/StockContext';

const TopGainersCard = () => {
    const [activeTab, setActiveTab] = useState('gainers');
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    const { getTopGainers, getTopLosers } = useStockData();

    useEffect(() => {
        loadTableData();
    }, [activeTab, getTopGainers, getTopLosers]);

    const loadTableData = async () => {
        try {
            setLoading(true);
            const data = activeTab === 'gainers' 
                ? await getTopGainers(5) 
                : await getTopLosers(5);
            
            const transformedData = data.map(stock => ({
                name: stock.stockName,
                stock: stock.ticker,
                openingPrice: stock.prevPrice,
                currentPrice: stock.currPrice,
                oneWeekChange: ((stock.currPrice - stock.prevPrice) / stock.prevPrice) * 100,
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
                                    <td>${row.currentPrice.toFixed(2)}</td>
                                    <td className={row.oneWeekChange >= 0 ? styles.positiveChange : styles.negativeChange}>
                                        {row.oneWeekChange >= 0 ? '+' : ''}{row.oneWeekChange.toFixed(2)}%
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
