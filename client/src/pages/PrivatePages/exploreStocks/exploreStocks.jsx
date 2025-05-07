import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./exploreStocks.module.css";
import { FaSearch, FaArrowUp, FaArrowDown } from "react-icons/fa";
import StockModal from '../components/StockModal/StockModal';

function ExploreStocks() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('all');
    const [selectedStock, setSelectedStock] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const sectors = [
        { id: 'all', name: 'All Sectors' },
        { id: 'tech', name: 'Technology' },
        { id: 'finance', name: 'Financial Services' },
        { id: 'healthcare', name: 'Healthcare' },
        { id: 'energy', name: 'Energy' },
        { id: 'consumer', name: 'Consumer Goods' }
    ];

    const popularStocks = [
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.42, change: 1.1, changePercent: 1.1, volume: 45000000, marketCap: 2150000000000, peRatio: 75.2, description: 'NVIDIA Corporation is a technology company that designs and manufactures graphics processing units (GPUs) for gaming, professional visualization, data centers, and artificial intelligence.', sector: 'Technology', industry: 'Semiconductors' },
        { symbol: 'META', name: 'Meta Platforms', price: 320.75, change: 1.5, changePercent: 1.5, volume: 25000000, marketCap: 850000000000, peRatio: 28.5, description: 'Meta Platforms, Inc. is a technology company that focuses on building products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and in-home devices.', sector: 'Technology', industry: 'Internet Services' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 178.75, change: 0.9, changePercent: 0.9, volume: 85000000, marketCap: 565000000000, peRatio: 42.3, description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.', sector: 'Automotive', industry: 'Electric Vehicles' },
        { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.5, changePercent: 2.5, volume: 65000000, marketCap: 2900000000000, peRatio: 31.2, description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.', sector: 'Technology', industry: 'Consumer Electronics' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.32, change: 1.8, changePercent: 1.8, volume: 25000000, marketCap: 3100000000000, peRatio: 35.8, description: 'Microsoft Corporation develops and supports software, services, devices, and solutions worldwide.', sector: 'Technology', industry: 'Software' }
    ];

    const allStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.5, changePercent: 2.5, volume: 65000000, marketCap: 2900000000000, peRatio: 31.2, description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.', sector: 'Technology', industry: 'Consumer Electronics' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.32, change: 1.8, changePercent: 1.8, volume: 25000000, marketCap: 3100000000000, peRatio: 35.8, description: 'Microsoft Corporation develops and supports software, services, devices, and solutions worldwide.', sector: 'Technology', industry: 'Software' },
        { symbol: 'JPM', name: 'JPMorgan Chase', price: 142.65, change: -0.8, changePercent: -0.8, volume: 15000000, marketCap: 420000000000, peRatio: 12.5, description: 'JPMorgan Chase & Co. operates as a financial services company worldwide.', sector: 'Financial Services', industry: 'Banking' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.42, change: 0.5, changePercent: 0.5, volume: 8000000, marketCap: 380000000000, peRatio: 15.2, description: 'Johnson & Johnson researches and develops, manufactures, and sells various products in the health care field worldwide.', sector: 'Healthcare', industry: 'Pharmaceuticals' },
        { symbol: 'XOM', name: 'Exxon Mobil', price: 102.75, change: -1.2, changePercent: -1.2, volume: 20000000, marketCap: 410000000000, peRatio: 8.5, description: 'Exxon Mobil Corporation explores for and produces crude oil and natural gas in the United States and internationally.', sector: 'Energy', industry: 'Oil & Gas' },
        { symbol: 'PG', name: 'Procter & Gamble', price: 145.33, change: 0.3, changePercent: 0.3, volume: 7000000, marketCap: 340000000000, peRatio: 24.8, description: 'The Procter & Gamble Company provides branded consumer packaged goods to consumers in North and Latin America, Europe, the Asia Pacific, Greater China, India, the Middle East, and Africa.', sector: 'Consumer Goods', industry: 'Household Products' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.65, change: 1.2, changePercent: 1.2, volume: 20000000, marketCap: 1800000000000, peRatio: 25.6, description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.', sector: 'Technology', industry: 'Internet Services' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.75, change: -0.9, changePercent: -0.9, volume: 30000000, marketCap: 1850000000000, peRatio: 60.5, description: 'Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.', sector: 'Technology', industry: 'E-commerce' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 178.75, change: 0.9, changePercent: 0.9, volume: 85000000, marketCap: 565000000000, peRatio: 42.3, description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.', sector: 'Automotive', industry: 'Electric Vehicles' },
        { symbol: 'META', name: 'Meta Platforms', price: 320.75, change: 1.5, changePercent: 1.5, volume: 25000000, marketCap: 850000000000, peRatio: 28.5, description: 'Meta Platforms, Inc. is a technology company that focuses on building products that enable people to connect and share with friends and family through mobile devices, personal computers, virtual reality headsets, and in-home devices.', sector: 'Technology', industry: 'Internet Services' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.42, change: 1.1, changePercent: 1.1, volume: 45000000, marketCap: 2150000000000, peRatio: 75.2, description: 'NVIDIA Corporation is a technology company that designs and manufactures graphics processing units (GPUs) for gaming, professional visualization, data centers, and artificial intelligence.', sector: 'Technology', industry: 'Semiconductors' },
        { symbol: 'V', name: 'Visa Inc.', price: 280.25, change: -0.4, changePercent: -0.4, volume: 12000000, marketCap: 580000000000, peRatio: 32.5, description: 'Visa Inc. operates as a payments technology company worldwide.', sector: 'Financial Services', industry: 'Payment Processing' }
    ];

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
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
                        {allStocks
                            .filter(stock => selectedSector === 'all' || stock.sector.toLowerCase() === selectedSector)
                            .map(stock => (
                                <div 
                                    key={stock.symbol} 
                                    className={styles.stockCard}
                                    onClick={() => handleStockClick(stock)}
                                >
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
                                        {sectors.find(s => s.id === stock.sector.toLowerCase())?.name}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
                
                <div className={styles.popularStocks}>
                    <h2>Most Popular Stocks</h2>
                    <div className={styles.popularStocksGrid}>
                        {popularStocks.map(stock => (
                            <div 
                                key={stock.symbol} 
                                className={styles.stockCard}
                                onClick={() => handleStockClick(stock)}
                            >
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
                />
            )}
        </div>
    );
}

export default ExploreStocks;