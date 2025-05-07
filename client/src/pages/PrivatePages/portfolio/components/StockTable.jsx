import React from 'react';
import styles from './StockTable.module.css';

const StockTable = ({ stocks }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    const formatPercentage = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.stockTable}>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Name</th>
                        <th>Shares</th>
                        <th>Avg Cost</th>
                        <th>Current Price</th>
                        <th>Total Value</th>
                        <th>Profit/Loss</th>
                        <th>% Change</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => (
                        <tr key={stock.symbol}>
                            <td>{stock.symbol}</td>
                            <td>{stock.name}</td>
                            <td>{stock.shares}</td>
                            <td>{formatCurrency(stock.avgCost)}</td>
                            <td>{formatCurrency(stock.currentPrice)}</td>
                            <td>{formatCurrency(stock.totalValue)}</td>
                            <td className={stock.profitLoss >= 0 ? styles.positive : styles.negative}>
                                {formatCurrency(stock.profitLoss)}
                            </td>
                            <td className={stock.profitLossPercentage >= 0 ? styles.positive : styles.negative}>
                                {formatPercentage(stock.profitLossPercentage)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockTable; 