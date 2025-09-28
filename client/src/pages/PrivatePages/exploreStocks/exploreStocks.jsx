import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./exploreStocks.module.css";
import { FaSearch, FaArrowUp, FaArrowDown, FaTimes } from "react-icons/fa";
import StockModal from '../components/StockModal/StockModal';

function ExploreStocks() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('all');
    const [selectedStock, setSelectedStock] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // TODO: SHOULD GET THIS FROM SERVER AND SHOULD BE IN A DIFFERENT FILE (GLOBAL)
    const sectors = [
        { id: 'all', name: 'All Sectors' },
        { id: 'tech', name: 'Technology' },
        { id: 'finance', name: 'Financial Services' },
        { id: 'healthcare', name: 'Healthcare' },
        { id: 'energy', name: 'Energy' },
        { id: 'consumer', name: 'Consumer Goods' }
    ];

    // TODO: SHOULD GET THIS FROM SERVER AND SHOULD BE IN A DIFFERENT FILE (GLOBAL)
    const popularStocks = [
        { symbol: 'NVDA', name: 'NVIDIA Corp.', openingPrice: 870.00, currentPrice: 875.42, oneWeekChange: 2.1, oneMonthChange: 8.5, threeMonthChange: 15.2, sixMonthChange: 28.7, sector: 'Technology' },
        { symbol: 'META', name: 'Meta Platforms', openingPrice: 315.00, currentPrice: 320.75, oneWeekChange: 1.8, oneMonthChange: 5.2, threeMonthChange: 12.4, sixMonthChange: 22.1, sector: 'Technology' },
        { symbol: 'TSLA', name: 'Tesla Inc.', openingPrice: 177.00, currentPrice: 178.75, oneWeekChange: 0.9, oneMonthChange: 3.1, threeMonthChange: 8.7, sixMonthChange: 18.3, sector: 'Automotive' },
        { symbol: 'AAPL', name: 'Apple Inc.', openingPrice: 181.00, currentPrice: 185.92, oneWeekChange: 2.5, oneMonthChange: 6.8, threeMonthChange: 11.2, sixMonthChange: 19.5, sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', openingPrice: 408.00, currentPrice: 415.32, oneWeekChange: 1.8, oneMonthChange: 4.9, threeMonthChange: 9.8, sixMonthChange: 16.4, sector: 'Technology' }
    ];

    // TODO: SHOULD GET THIS FROM SERVER AND SHOULD BE IN A DIFFERENT FILE (GLOBAL)
    const allStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', openingPrice: 181.00, currentPrice: 185.92, oneWeekChange: 2.5, oneMonthChange: 6.8, threeMonthChange: 11.2, sixMonthChange: 19.5, sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', openingPrice: 408.00, currentPrice: 415.32, oneWeekChange: 1.8, oneMonthChange: 4.9, threeMonthChange: 9.8, sixMonthChange: 16.4, sector: 'Technology' },
        { symbol: 'JPM', name: 'JPMorgan Chase', openingPrice: 144.00, currentPrice: 142.65, oneWeekChange: -0.8, oneMonthChange: -2.1, threeMonthChange: 1.5, sixMonthChange: 4.2, sector: 'Financial Services' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', openingPrice: 157.50, currentPrice: 158.42, oneWeekChange: 0.5, oneMonthChange: 1.2, threeMonthChange: 2.8, sixMonthChange: 5.1, sector: 'Healthcare' },
        { symbol: 'XOM', name: 'Exxon Mobil', openingPrice: 104.00, currentPrice: 102.75, oneWeekChange: -1.2, oneMonthChange: -3.5, threeMonthChange: -1.8, sixMonthChange: 2.3, sector: 'Energy' },
        { symbol: 'PG', name: 'Procter & Gamble', openingPrice: 145.00, currentPrice: 145.33, oneWeekChange: 0.3, oneMonthChange: 0.8, threeMonthChange: 2.1, sixMonthChange: 3.7, sector: 'Consumer Goods' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', openingPrice: 141.00, currentPrice: 142.65, oneWeekChange: 1.2, oneMonthChange: 3.4, threeMonthChange: 7.8, sixMonthChange: 12.6, sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', openingPrice: 180.00, currentPrice: 178.75, oneWeekChange: -0.9, oneMonthChange: 1.2, threeMonthChange: 4.5, sixMonthChange: 8.9, sector: 'Technology' },
        { symbol: 'TSLA', name: 'Tesla Inc.', openingPrice: 177.00, currentPrice: 178.75, oneWeekChange: 0.9, oneMonthChange: 3.1, threeMonthChange: 8.7, sixMonthChange: 18.3, sector: 'Automotive' },
        { symbol: 'META', name: 'Meta Platforms', openingPrice: 315.00, currentPrice: 320.75, oneWeekChange: 1.8, oneMonthChange: 5.2, threeMonthChange: 12.4, sixMonthChange: 22.1, sector: 'Technology' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', openingPrice: 870.00, currentPrice: 875.42, oneWeekChange: 2.1, oneMonthChange: 8.5, threeMonthChange: 15.2, sixMonthChange: 28.7, sector: 'Technology' },
        { symbol: 'V', name: 'Visa Inc.', openingPrice: 281.00, currentPrice: 280.25, oneWeekChange: -0.4, oneMonthChange: 0.8, threeMonthChange: 3.2, sixMonthChange: 6.8, sector: 'Financial Services' }
    ];

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    // Filter stocks based on search query and sector
    const getFilteredStocks = (stocks) => {
        return stocks.filter(stock => {
            const matchesSearch = searchQuery === '' || 
                stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                stock.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesSector = selectedSector === 'all' || 
                stock.sector.toLowerCase() === selectedSector;
            
            return matchesSearch && matchesSector;
        });
    };

    const handleSectorChange = (sectorId) => {
        setSelectedSector(sectorId);
    };

    const handleStockClick = (stock) => {
        setSelectedStock(stock);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStock(null);
    };

    const handleTransactionComplete = () => {
        // Added for later use
    };

    return (
        <div className={styles.exploreStocks}>
            <Navbar />
            <div className={styles.content}>
                <div className={styles.searchSection}>
                    <h1>Explore Stocks</h1>
                    <div className={styles.searchBar}>
                        <FaSearch className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search stocks by symbol or company name..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className={styles.sectorFilter}>
                    <h2>Browse by Sector</h2>
                    <div className={styles.sectorButtons}>
                        {sectors.map(sector => (
                            <button
                                key={sector.id}
                                className={`${styles.sectorButton} ${selectedSector === sector.id ? styles.activeSector : ''}`}
                                onClick={() => handleSectorChange(sector.id)}
                            >
                                {sector.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.allStocks}>
                    <h2>All Stocks</h2>
                    <div className={styles.stocksGrid}>
                        {getFilteredStocks(allStocks).map(stock => (
                                <div 
                                    key={stock.symbol} 
                                    className={styles.stockCard}
                                    onClick={() => handleStockClick(stock)}
                                >
                                    <div className={styles.stockHeader}>
                                        <span className={styles.symbol}>{stock.symbol}</span>
                                        <span className={stock.currentPrice >= stock.openingPrice ? styles.positive : styles.negative}>
                                            {stock.currentPrice >= stock.openingPrice ? <FaArrowUp /> : <FaArrowDown />}
                                            {Math.abs(((stock.currentPrice - stock.openingPrice) / stock.openingPrice * 100)).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className={styles.stockName}>{stock.name}</div>
                                    <div className={styles.stockPrice}>${stock.currentPrice.toFixed(2)}</div>
                                    <div className={styles.stockSector}>
                                        {sectors.find(s => s.id === stock.sector.toLowerCase())?.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                
                <div className={styles.popularStocks}>
                    <h2>Most Popular Stocks</h2>
                    <div className={styles.popularStocksGrid}>
                        {getFilteredStocks(popularStocks).map(stock => (
                            <div 
                                key={stock.symbol} 
                                className={styles.stockCard}
                                onClick={() => handleStockClick(stock)}
                            >
                                <div className={styles.stockHeader}>
                                    <span className={styles.symbol}>{stock.symbol}</span>
                                    <span className={stock.currentPrice >= stock.openingPrice ? styles.positive : styles.negative}>
                                        {stock.currentPrice >= stock.openingPrice ? <FaArrowUp /> : <FaArrowDown />}
                                        {Math.abs(((stock.currentPrice - stock.openingPrice) / stock.openingPrice * 100)).toFixed(1)}%
                                    </span>
                                </div>
                                <div className={styles.stockName}>{stock.name}</div>
                                <div className={styles.stockPrice}>${stock.currentPrice.toFixed(2)}</div>
                                <div className={styles.stockSector}>
                                    {sectors.find(s => s.id === stock.sector.toLowerCase())?.name}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedStock && (
                <StockModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    stock={selectedStock}
                    onTransactionComplete={handleTransactionComplete}
                />
            )}
        </div>
    );
}

export default ExploreStocks;