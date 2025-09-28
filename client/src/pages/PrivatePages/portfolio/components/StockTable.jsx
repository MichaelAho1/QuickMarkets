import React from 'react';
import styles from './StockTable.module.css';

const StockTable = ({ stocks, onStockClick }) => {
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

    const calculateDayChange = (currentPrice, openingPrice) => {
        if (!openingPrice || openingPrice === 0) return 0;
        return ((currentPrice - openingPrice) / openingPrice) * 100;
    };

    return (
        <div>
            <h1 className={styles.heading}>Stocks Owned</h1>
            <div className={styles.tableContainer}>
                <table className={styles.stockTable}>
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Shares</th>
                            <th>Avg Cost</th>
                            <th>Current Price</th>
                            <th>Total Value</th>
                            <th>Profit/Loss</th>
                            <th>Day Change</th>
                            <th>All Time Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stock) => {
                            const dayChange = calculateDayChange(stock.currentPrice, stock.openingPrice);
                            return (
                                <tr 
                                    key={stock.symbol} 
                                    className={styles.clickableRow}
                                    onClick={() => onStockClick && onStockClick(stock)}
                                >
                                    <td>{stock.symbol}</td>
                                    <td>{stock.shares}</td>
                                    <td>{formatCurrency(stock.avgCost)}</td>
                                    <td>{formatCurrency(stock.currentPrice)}</td>
                                    <td>{formatCurrency(stock.totalValue)}</td>
                                    <td className={stock.profitLoss >= 0 ? styles.positive : styles.negative}>
                                        {formatCurrency(stock.profitLoss)}
                                    </td>
                                    <td className={dayChange >= 0 ? styles.positive : styles.negative}>
                                        {dayChange.toFixed(2)}%
                                    </td>
                                    <td className={stock.profitLossPercentage >= 0 ? styles.positive : styles.negative}>
                                        {stock.profitLossPercentage.toFixed(2)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockTable; 