import React from 'react';
import styles from './BottomTables.module.css';

const BottomTables = () => {
    const sectors = [
        { name: 'Technology', percentage: 45, value: 2500 },
        { name: 'Healthcare', percentage: 20, value: 1100 },
        { name: 'Finance', percentage: 15, value: 850 },
        { name: 'Consumer Goods', percentage: 10, value: 550 },
        { name: 'Energy', percentage: 10, value: 550 }
    ];

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
                            {sectors.map((sector, index) => (
                                <tr key={index}>
                                    <td>{sector.name}</td>
                                    <td>
                                        <div className={styles.percentageBar}>
                                            <div 
                                                className={styles.barFill} 
                                                style={{ width: `${sector.percentage}%` }}
                                            ></div>
                                            <span>{sector.percentage}%</span>
                                        </div>
                                    </td>
                                    <td>${sector.value.toLocaleString()}</td>
                                </tr>
                            ))}
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