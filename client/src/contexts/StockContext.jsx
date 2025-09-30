import React, { createContext, useContext, useState, useEffect } from 'react';
import stockCacheService from '../services/stockCacheService.js';
import portfolioCacheService from '../services/portfolioCacheService.js';
import watchlistService from '../services/watchlistService.js';
import { calculatePortfolioValues, calculatePortfolioSummary } from '../utils/portfolioCalculations.js';

const StockContext = createContext();

export const useStockData = () => {
    const context = useContext(StockContext);
    if (!context) {
        throw new Error('useStockData must be used within a StockProvider');
    }
    return context;
};

export const StockProvider = ({ children }) => {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    
    // Portfolio data state
    const [portfolioData, setPortfolioData] = useState(null);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [portfolioError, setPortfolioError] = useState(null);
    const [calculatedPortfolio, setCalculatedPortfolio] = useState(null);

    // Watchlist state
    const [watchlist, setWatchlist] = useState([]);
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [watchlistError, setWatchlistError] = useState(null);

    // Simulation day state
    const [simulationDay, setSimulationDay] = useState(null);
    const [simulationDayLoading, setSimulationDayLoading] = useState(true);
    const [simulationDayError, setSimulationDayError] = useState(null);

    // Refresh indicator state
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Load stock data on mount
    useEffect(() => {
        loadStockData();
        loadPortfolioData();
        loadWatchlist();
        loadSimulationDay();
    }, []);

    // Recalculate portfolio values when portfolio data or stock data changes
    useEffect(() => {
        if (portfolioData && stocks.length > 0) {
            const calculated = calculatePortfolioValues(portfolioData, stocks);
            setCalculatedPortfolio(calculated);
        }
    }, [portfolioData, stocks]);

    const loadStockData = async (forceRefresh = false, showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError(null);
            
            const stockData = await stockCacheService.getStockPrices(forceRefresh);
            setStocks(stockData);
            setLastUpdated(new Date());
        } catch (err) {
            setError('Failed to load stock data');
            console.error('Error loading stock data:', err);
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    const refreshStockData = () => {
        return loadStockData(true);
    };

    const loadPortfolioData = async (forceRefresh = false, showLoading = true) => {
        try {
            if (showLoading) {
                setPortfolioLoading(true);
            }
            setPortfolioError(null);
            
            const data = await portfolioCacheService.getPortfolioData(forceRefresh);
            setPortfolioData(data);
        } catch (err) {
            setPortfolioError('Failed to load portfolio data');
            console.error('Error loading portfolio data:', err);
        } finally {
            if (showLoading) {
                setPortfolioLoading(false);
            }
        }
    };

    const refreshPortfolioData = () => {
        return loadPortfolioData(true);
    };

    // Smooth refresh functions for auto-refresh (no loading states)
    const smoothRefreshStockData = async () => {
        try {
            setIsRefreshing(true);
            await loadStockData(true, false);
        } catch (error) {
            console.error('Error during smooth stock refresh:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const smoothRefreshPortfolioData = async () => {
        try {
            setIsRefreshing(true);
            await loadPortfolioData(true, false);
        } catch (error) {
            console.error('Error during smooth portfolio refresh:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const smoothRefreshAll = async () => {
        try {
            setIsRefreshing(true);
            await Promise.all([
                loadStockData(true, false),
                loadPortfolioData(true, false)
            ]);
        } catch (error) {
            console.error('Error during smooth refresh:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    const getPortfolioSummary = () => {
        if (portfolioData && stocks.length > 0) {
            return calculatePortfolioSummary(portfolioData, stocks);
        }
        return {
            totalNetWorth: portfolioData?.summary?.cashBalance || 0,
            portfolioDayChange: 0
        };
    };

    const getStockByTicker = (ticker) => {
        return stocks.find(stock => stock.ticker === ticker);
    };

    const getStocksBySector = (sectorTicker) => {
        return stocks.filter(stock => stock.sectorType === sectorTicker);
    };


    const getPopularStocks = (limit = 5) => {
        // For now, return the first few stocks as "popular"
        // This could be enhanced with actual popularity metrics
        return stocks.slice(0, limit);
    };

    const getAllStocks = () => {
        return stocks;
    };


    const loadWatchlist = async () => {
        try {
            setWatchlistLoading(true);
            setWatchlistError(null);
            const watchlistData = await watchlistService.getWatchlist();
            setWatchlist(watchlistData);
        } catch (err) {
            setWatchlistError('Failed to load watchlist');
            console.error('Error loading watchlist:', err);
        } finally {
            setWatchlistLoading(false);
        }
    };

    const loadSimulationDay = async (forceRefresh = false, showLoading = true) => {
        try {
            if (showLoading) {
                setSimulationDayLoading(true);
            }
            setSimulationDayError(null);
            
            const response = await fetch('http://localhost:8000/api/simulation-day/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setSimulationDay(data);
        } catch (err) {
            setSimulationDayError('Failed to load simulation day');
            console.error('Error loading simulation day:', err);
            // Set a default value if the API fails
            setSimulationDay({
                current_day: 1
            });
        } finally {
            if (showLoading) {
                setSimulationDayLoading(false);
            }
        }
    };

    const refreshSimulationDay = async () => {
        return loadSimulationDay(true, false);
    };

    const addToWatchlist = async (ticker) => {
        try {
            await watchlistService.addToWatchlist(ticker);
            await loadWatchlist(); // Refresh watchlist
        } catch (err) {
            console.error('Error adding to watchlist:', err);
            throw err;
        }
    };

    const removeFromWatchlist = async (ticker) => {
        try {
            await watchlistService.removeFromWatchlist(ticker);
            await loadWatchlist(); // Refresh watchlist
        } catch (err) {
            console.error('Error removing from watchlist:', err);
            throw err;
        }
    };

    const isInWatchlist = (ticker) => {
        return watchlist.some(item => item.ticker === ticker);
    };

    const getWatchlistStocks = () => {
        return watchlist.map(item => {
            const stock = getStockByTicker(item.ticker);
            return stock ? stock : null;
        }).filter(Boolean);
    };

    const value = {
        stocks,
        loading,
        error,
        lastUpdated,
        loadStockData,
        refreshStockData,
        smoothRefreshStockData,
        smoothRefreshPortfolioData,
        smoothRefreshAll,
        isRefreshing,
        getStockByTicker,
        getStocksBySector,
        getPopularStocks,
        getAllStocks,
        portfolioData,
        portfolioLoading,
        portfolioError,
        loadPortfolioData,
        refreshPortfolioData,
        calculatedPortfolio,
        getPortfolioSummary,
        watchlist,
        watchlistLoading,
        watchlistError,
        loadWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        getWatchlistStocks,
        simulationDay,
        simulationDayLoading,
        simulationDayError,
        loadSimulationDay,
        refreshSimulationDay
    };

    return (
        <StockContext.Provider value={value}>
            {children}
        </StockContext.Provider>
    );
};
