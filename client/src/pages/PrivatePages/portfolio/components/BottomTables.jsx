import React from 'react';
import styles from './BottomTables.module.css';

const BottomTables = ({ portfolioData }) => {
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
            const value = stock.currentValue || 0;
            
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

    const history = [
        { date: '2024-03-15', value: 4800, change: '+2.5%' },
        { date: '2024-03-14', value: 4680, change: '-1.2%' },
        { date: '2024-03-13', value: 4736, change: '+1.8%' },
        { date: '2024-03-12', value: 4652, change: '-0.5%' },
        { date: '2024-03-11', value: 4675, change: '+0.3%' }
    ];

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
                <h3>Portfolio History</h3>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Value</th>
                                <th>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.date}</td>
                                    <td>${entry.value.toLocaleString()}</td>
                                    <td className={entry.change.startsWith('+') ? styles.positiveChange : styles.negativeChange}>
                                        {entry.change}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BottomTables; 