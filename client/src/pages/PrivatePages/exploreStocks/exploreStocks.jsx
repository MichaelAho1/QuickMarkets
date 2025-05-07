import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./exploreStocks.module.css";
import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";

function ExploreStocks() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('all');

    const sectors = [
        { id: 'all', name: 'All Sectors' },
        { id: 'tech', name: 'Technology' },
        { id: 'finance', name: 'Financial Services' },
        { id: 'healthcare', name: 'Healthcare' },
        { id: 'energy', name: 'Energy' },
        { id: 'consumer', name: 'Consumer Goods' }
    ];

    const popularStocks = [
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.42, change: 1.1, sector: 'tech' },
        { symbol: 'META', name: 'Meta Platforms', price: 320.75, change: 1.5, sector: 'tech' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 178.75, change: 0.9, sector: 'tech' },
        { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.5, sector: 'tech' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.32, change: 1.8, sector: 'tech' }
    ];

    const allStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.5, sector: 'tech' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.32, change: 1.8, sector: 'tech' },
        { symbol: 'JPM', name: 'JPMorgan Chase', price: 142.65, change: -0.8, sector: 'finance' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.42, change: 0.5, sector: 'healthcare' },
        { symbol: 'XOM', name: 'Exxon Mobil', price: 102.75, change: -1.2, sector: 'energy' },
        { symbol: 'PG', name: 'Procter & Gamble', price: 145.33, change: 0.3, sector: 'consumer' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.65, change: 1.2, sector: 'tech' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.75, change: -0.9, sector: 'tech' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 178.75, change: 0.9, sector: 'tech' },
        { symbol: 'META', name: 'Meta Platforms', price: 320.75, change: 1.5, sector: 'tech' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.42, change: 1.1, sector: 'tech' },
        { symbol: 'V', name: 'Visa Inc.', price: 280.25, change: -0.4, sector: 'finance' }
    ];

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSectorChange = (sectorId) => {
        setSelectedSector(sectorId);
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

                <div className={styles.popularStocks}>
                    <h2>Most Popular Stocks</h2>
                    <div className={styles.popularStocksGrid}>
                        {popularStocks.map(stock => (
                            <div key={stock.symbol} className={styles.stockCard}>
                                <div className={styles.stockHeader}>
                                    <span className={styles.symbol}>{stock.symbol}</span>
                                    <span className={stock.change >= 0 ? styles.positive : styles.negative}>
                                        {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                        {Math.abs(stock.change)}%
                                    </span>
                                </div>
                                <div className={styles.stockName}>{stock.name}</div>
                                <div className={styles.stockPrice}>${stock.price.toFixed(2)}</div>
                                <div className={styles.stockSector}>
                                    {sectors.find(s => s.id === stock.sector)?.name}
                                </div>
                            </div>
                        ))}
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
                        {allStocks
                            .filter(stock => selectedSector === 'all' || stock.sector === selectedSector)
                            .map(stock => (
                                <div key={stock.symbol} className={styles.stockCard}>
                                    <div className={styles.stockHeader}>
                                        <span className={styles.symbol}>{stock.symbol}</span>
                                        <span className={stock.change >= 0 ? styles.positive : styles.negative}>
                                            {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                            {Math.abs(stock.change)}%
                                        </span>
                                    </div>
                                    <div className={styles.stockName}>{stock.name}</div>
                                    <div className={styles.stockPrice}>${stock.price.toFixed(2)}</div>
                                    <div className={styles.stockSector}>
                                        {sectors.find(s => s.id === stock.sector)?.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExploreStocks;