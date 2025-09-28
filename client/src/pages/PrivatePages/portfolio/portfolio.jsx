import React, { useState, useEffect } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import BottomTables from './components/BottomTables';
import StockTable from './components/StockTable';
import DonutChart from './components/DonutChart';
import StockModal from '../components/StockModal/StockModal';
import styles from "./portfolio.module.css";
import { useStockData } from '../../../contexts/StockContext';

function stocksOwned() {
    const [selectedStock, setSelectedStock] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { 
        calculatedPortfolio, 
        portfolioLoading, 
        portfolioError, 
        refreshPortfolioData 
    } = useStockData();

    const handleTransactionComplete = () => {
        refreshPortfolioData();
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

    if (portfolioLoading) {
        return (
            <div className={styles.portfolio}>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <p>Loading portfolio data...</p>
                </div>
            </div>
        );
    }

    const stocks = calculatedPortfolio.portfolio;
    const portfolioValue = calculatedPortfolio.summary.totalPortfolioValue;
    const cashBalance = calculatedPortfolio.summary.cashBalance;
    const totalNetWorth = calculatedPortfolio.summary.totalNetWorth;

    return (
        <div className={styles.portfolio}> 
            <Navbar />
            <header>
                <h1>Portfolio Overview</h1>
                <div className={styles.portfolioSummary}>
                    <div className={styles.summaryItem}>
                        <span className={styles.label}>Total Portfolio Value:</span>
                        <span className={styles.value}>${portfolioValue.toFixed(2)}</span>
                    </div>
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
                        <span className={`${styles.value} ${calculatedPortfolio.summary.overallProfitLoss >= 0 ? styles.positive : styles.negative}`}>
                            {calculatedPortfolio.summary.overallProfitLoss >= 0 ? '+' : ''}${calculatedPortfolio.summary.overallProfitLoss.toFixed(2)} 
                            ({calculatedPortfolio.summary.overallProfitLossPercent >= 0 ? '+' : ''}{calculatedPortfolio.summary.overallProfitLossPercent.toFixed(2)}%)
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
            <BottomTables portfolioData={calculatedPortfolio} />
            
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