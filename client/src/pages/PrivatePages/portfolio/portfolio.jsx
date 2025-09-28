import React, { useState, useEffect } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import BottomTables from './components/BottomTables';
import StockTable from './components/StockTable';
import DonutChart from './components/DonutChart';
import StockModal from '../components/StockModal/StockModal';
import styles from "./portfolio.module.css";
import api from '../../../api/api.js';

function stocksOwned() {
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPortfolioData();
    }, []);

    const fetchPortfolioData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/user-portfolio/');
            setPortfolioData(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch portfolio data');
            console.error('Error fetching portfolio:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionComplete = () => {
        fetchPortfolioData();
    };

    const handleStockClick = (stock) => {
        const stockForModal = {
            symbol: stock.symbol,
            name: stock.name,
            openingPrice: stock.openingPrice, 
            currentPrice: stock.currentPrice,
            oneWeekChange: 0,
            oneMonthChange: 0,
            threeMonthChange: 0,
            sixMonthChange: 0,
            sector: stock.sector
        };
        
        setSelectedStock(stockForModal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStock(null);
    };

    if (loading) {
        return (
            <div className={styles.portfolio}>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <p>Loading portfolio data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.portfolio}>
                <Navbar />
                <div className={styles.errorContainer}>
                    <p>Error: {error}</p>
                    <button onClick={fetchPortfolioData}>Retry</button>
                </div>
            </div>
        );
    }

    if (!portfolioData) {
        return (
            <div className={styles.portfolio}>
                <Navbar />
                <div className={styles.emptyContainer}>
                    <p>No portfolio data available</p>
                </div>
            </div>
        );
    }

    // Transforms API data to match component expectations
    const stocks = portfolioData.portfolio.map(stock => ({
        symbol: stock.ticker,
        name: stock.stockName,
        shares: stock.shares,
        avgCost: stock.averageCost,
        currentPrice: stock.currentPrice,
        openingPrice: stock.openingPrice,
        totalValue: stock.currentValue,
        profitLoss: stock.profitLoss,
        profitLossPercentage: stock.profitLossPercent,
        sector: stock.sector
    }));

    const portfolioValue = portfolioData.summary.totalPortfolioValue;
    const cashBalance = portfolioData.summary.cashBalance;
    const totalNetWorth = portfolioData.summary.totalNetWorth;

    return (
        <div className={styles.portfolio}> 
            <Navbar />
            <header>
                <h1>Total Portfolio Value</h1>
                <h2>${portfolioValue.toFixed(2)}</h2>
                <div className={styles.portfolioSummary}>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>Cash Balance:</span>
                        <span className={styles.value}>${cashBalance.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>Total Net Worth:</span>
                        <span className={styles.value}>${totalNetWorth.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>Overall P&L:</span>
                        <span className={`${styles.value} ${portfolioData.summary.overallProfitLoss >= 0 ? styles.positive : styles.negative}`}>
                            {portfolioData.summary.overallProfitLoss >= 0 ? '+' : ''}${portfolioData.summary.overallProfitLoss.toFixed(2)} 
                            ({portfolioData.summary.overallProfitLossPercent >= 0 ? '+' : ''}{portfolioData.summary.overallProfitLossPercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </header>
            <div className={styles.stockSection}>
                <div className={styles.card}>
                    <div className={styles.contentWrapper}>
                        <div className={styles.tableWrapper}>
                            <StockTable stocks={stocks} onStockClick={handleStockClick} />
                        </div>
                        <div className={styles.chartWrapper}>
                            <DonutChart stocks={stocks} />
                        </div>
                    </div>
                </div>
            </div>
            <BottomTables portfolioData={portfolioData} />
            
            {selectedStock && (
                <StockModal
                    stock={selectedStock}
                    onClose={handleCloseModal}
                    onTransactionComplete={handleTransactionComplete}
                />
            )}
        </div>
    );
}

export default stocksOwned;