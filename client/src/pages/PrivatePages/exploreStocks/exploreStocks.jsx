import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./exploreStocks.module.css";
import { FaSearch, FaArrowUp, FaArrowDown, FaTimes } from "react-icons/fa";
import StockModal from '../components/StockModal/StockModal';
import { useStockData } from '../../../contexts/StockContext';

function ExploreStocks() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSector, setSelectedSector] = useState('all');
    const [selectedStock, setSelectedStock] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [popularStocks, setPopularStocks] = useState([]);
    const [allStocks, setAllStocks] = useState([]);

    const { 
        stocks, 
        loading, 
        error, 
        getPopularStocks, 
        getAllStocks, 
        getStocksBySector,
        smoothRefreshStockData,
        smoothRefreshPortfolioData,
        isRefreshing
    } = useStockData();

    // Auto-refresh data every 5 seconds to match simulation frequency
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await smoothRefreshStockData();
            } catch (error) {
                console.error('Error refreshing stock data:', error);
            }
        }, 5000); // Refresh every 5 seconds to catch simulation updates

        return () => clearInterval(interval);
    }, [smoothRefreshStockData]);

    // Sector mapping for filtering
    const sectors = [
        { id: 'all', name: 'All Sectors' },
        { id: 'TECH', name: 'Technology' },
        { id: 'FIN', name: 'Financial Services' },
        { id: 'HEALTH', name: 'Healthcare' },
        { id: 'ENRG', name: 'Energy' },
        { id: 'CONS', name: 'Consumer Goods' }
    ];

    // Load stock data when component mounts
    useEffect(() => {
        if (stocks.length > 0) {
            setPopularStocks(getPopularStocks(5));
            setAllStocks(getAllStocks());
        }
    }, [stocks, getPopularStocks, getAllStocks]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const transformStockForDisplay = (stock) => {
        const percentageChange = ((stock.currPrice - stock.prevPrice) / stock.prevPrice) * 100;
        return {
            symbol: stock.ticker,
            name: stock.stockName,
            openingPrice: stock.prevPrice,
            currentPrice: stock.currPrice,
            oneWeekChange: percentageChange,
            oneMonthChange: 0, // These would need historical data
            threeMonthChange: 0,
            sixMonthChange: 0,
            sector: stock.sectorType
        };
    };

    // Filter stocks based on search query and sector
    const getFilteredStocks = (stocks) => {
        return stocks.filter(stock => {
            const matchesSearch = searchQuery === '' || 
                stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
                stock.stockName.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesSector = selectedSector === 'all' || 
                stock.sectorType === selectedSector;
            
            return matchesSearch && matchesSector;
        });
    };

    const handleSectorChange = (sectorId) => {
        setSelectedSector(sectorId);
    };

    const handleStockClick = (stock) => {
        const transformedStock = transformStockForDisplay(stock);
        setSelectedStock(transformedStock);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStock(null);
    };

    const handleTransactionComplete = async (transactionData) => {
        // Refresh portfolio data to reflect the new purchase
        await smoothRefreshPortfolioData();
        
        // Navigate to portfolio page after successful purchase
        navigate('/admin/portfolio');
    };

    if (loading) {
        return (
            <div className={styles.exploreStocks}>
                <Navbar />
                <div className={styles.content}>
                    <div className={styles.loadingContainer}>
                        <p>Loading stock data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.exploreStocks}>
                <Navbar />
                <div className={styles.content}>
                    <div className={styles.errorContainer}>
                        <p>Error: {error}</p>
                    </div>
                </div>
            </div>
        );
    }

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
                        {getFilteredStocks(allStocks).map(stock => {
                            const transformedStock = transformStockForDisplay(stock);
                            return (
                                <div 
                                    key={stock.ticker} 
                                    className={styles.stockCard}
                                    onClick={() => handleStockClick(stock)}
                                >
                                    <div className={styles.stockHeader}>
                                        <span className={styles.symbol}>{transformedStock.symbol}</span>
                                        <span className={transformedStock.currentPrice >= transformedStock.openingPrice ? styles.positive : styles.negative}>
                                            {transformedStock.currentPrice >= transformedStock.openingPrice ? <FaArrowUp /> : <FaArrowDown />}
                                            {Math.abs(transformedStock.oneWeekChange).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className={styles.stockName}>{transformedStock.name}</div>
                                    <div className={styles.stockPrice}>${transformedStock.currentPrice.toFixed(2)}</div>
                                    <div className={styles.stockSector}>
                                        {sectors.find(s => s.id === transformedStock.sector)?.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className={styles.popularStocks}>
                    <h2>Most Popular Stocks</h2>
                    <div className={styles.popularStocksGrid}>
                        {getFilteredStocks(popularStocks).map(stock => {
                            const transformedStock = transformStockForDisplay(stock);
                            return (
                                <div 
                                    key={stock.ticker} 
                                    className={styles.stockCard}
                                    onClick={() => handleStockClick(stock)}
                                >
                                    <div className={styles.stockHeader}>
                                        <span className={styles.symbol}>{transformedStock.symbol}</span>
                                        <span className={transformedStock.currentPrice >= transformedStock.openingPrice ? styles.positive : styles.negative}>
                                            {transformedStock.currentPrice >= transformedStock.openingPrice ? <FaArrowUp /> : <FaArrowDown />}
                                            {Math.abs(transformedStock.oneWeekChange).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className={styles.stockName}>{transformedStock.name}</div>
                                    <div className={styles.stockPrice}>${transformedStock.currentPrice.toFixed(2)}</div>
                                    <div className={styles.stockSector}>
                                        {sectors.find(s => s.id === transformedStock.sector)?.name}
                                    </div>
                                </div>
                            );
                        })}
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