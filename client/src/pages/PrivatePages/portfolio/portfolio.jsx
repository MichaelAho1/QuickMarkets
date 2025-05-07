import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import BottomTables from './components/BottomTables';
import StockTable from './components/StockTable';
import DonutChart from './components/DonutChart';
import styles from "./portfolio.module.css";

function stocksOwned() {
    const [portfolioValue, setPortfolioValue] = useState(1374.85);
    
    //Temp Stocks
    const stocks = [
        {
            symbol: 'AAPL',
            name: 'Apple Inc.',
            shares: 10,
            avgCost: 145.50,
            currentPrice: 150.25,
            totalValue: 1502.50,
            profitLoss: 47.50,
            profitLossPercentage: 3.26
        },
        {
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            shares: 5,
            avgCost: 275.00,
            currentPrice: 280.75,
            totalValue: 1403.75,
            profitLoss: 28.75,
            profitLossPercentage: 2.09
        },
        {
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            shares: 3,
            avgCost: 120.00,
            currentPrice: 125.50,
            totalValue: 376.50,
            profitLoss: 16.50,
            profitLossPercentage: 4.58
        },
        {
            symbol: 'AMZN',
            name: 'Amazon.com Inc.',
            shares: 8,
            avgCost: 140.00,
            currentPrice: 145.25,
            totalValue: 1162.00,
            profitLoss: 42.00,
            profitLossPercentage: 3.75
        },
        {
            symbol: 'TSLA',
            name: 'Tesla Inc.',
            shares: 2,
            avgCost: 175.00,
            currentPrice: 180.50,
            totalValue: 361.00,
            profitLoss: 11.00,
            profitLossPercentage: 3.14
        },
        {
            symbol: 'META',
            name: 'Meta Platforms Inc.',
            shares: 6,
            avgCost: 305.00,
            currentPrice: 320.75,
            totalValue: 1924.50,
            profitLoss: 94.50,
            profitLossPercentage: 5.16
        },
        {
            symbol: 'NVDA',
            name: 'NVIDIA Corporation',
            shares: 4,
            avgCost: 420.00,
            currentPrice: 450.25,
            totalValue: 1801.00,
            profitLoss: 121.00,
            profitLossPercentage: 7.20
        },
        {
            symbol: 'JPM',
            name: 'JPMorgan Chase & Co.',
            shares: 7,
            avgCost: 173.00,
            currentPrice: 175.50,
            totalValue: 1228.50,
            profitLoss: 17.50,
            profitLossPercentage: 1.45
        },
        {
            symbol: 'V',
            name: 'Visa Inc.',
            shares: 5,
            avgCost: 272.50,
            currentPrice: 280.25,
            totalValue: 1401.25,
            profitLoss: 38.75,
            profitLossPercentage: 2.84
        },
        {
            symbol: 'WMT',
            name: 'Walmart Inc.',
            shares: 12,
            avgCost: 61.00,
            currentPrice: 60.75,
            totalValue: 729.00,
            profitLoss: -3.00,
            profitLossPercentage: -0.41
        }
    ];

    return (
        <div className={styles.portfolio}> 
            <Navbar />
            <header>
                <h1>Total Portfolio Value</h1>
                <h2>${portfolioValue.toFixed(2)}</h2>
            </header>
            <div className={styles.stockSection}>
                <div className={styles.card}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.tableWrapper}>
                            <StockTable stocks={stocks} />
                        </div>
                        <div className={styles.chartWrapper}>
                            <DonutChart stocks={stocks} />
                        </div>
                    </div>
                </div>
            </div>
            <BottomTables />
        </div>
    );
}

export default stocksOwned;