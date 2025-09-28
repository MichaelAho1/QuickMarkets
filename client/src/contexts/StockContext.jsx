import React, { createContext, useContext, useState, useEffect } from 'react';
import stockCacheService from '../services/stockCacheService.js';
import portfolioCacheService from '../services/portfolioCacheService.js';
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

    // Load stock data on mount
    useEffect(() => {
        loadStockData();
        loadPortfolioData();
    }, []);

    // Recalculate portfolio values when portfolio data or stock data changes
    useEffect(() => {
        if (portfolioData && stocks.length > 0) {
            const calculated = calculatePortfolioValues(portfolioData, stocks);
            setCalculatedPortfolio(calculated);
        }
    }, [portfolioData, stocks]);

    const loadStockData = async (forceRefresh = false) => {
        try {
            setLoading(true);
            setError(null);
            
            const stockData = await stockCacheService.getStockPrices(forceRefresh);
            setStocks(stockData);
            setLastUpdated(new Date());
        } catch (err) {
            setError('Failed to load stock data');
            console.error('Error loading stock data:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshStockData = () => {
        return loadStockData(true);
    };

    const loadPortfolioData = async (forceRefresh = false) => {
        try {
            setPortfolioLoading(true);
            setPortfolioError(null);
            
            const data = await portfolioCacheService.getPortfolioData(forceRefresh);
            setPortfolioData(data);
        } catch (err) {
            setPortfolioError('Failed to load portfolio data');
            console.error('Error loading portfolio data:', err);
        } finally {
            setPortfolioLoading(false);
        }
    };

    const refreshPortfolioData = () => {
        return loadPortfolioData(true);
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

    const getTopGainers = async (limit = 5) => {
        return await stockCacheService.getTopStocks(limit, 'gainers');
    };

    const getTopLosers = async (limit = 5) => {
        return await stockCacheService.getTopStocks(limit, 'losers');
    };

    const getPopularStocks = (limit = 5) => {
        // For now, return the first few stocks as "popular"
        // This could be enhanced with actual popularity metrics
        return stocks.slice(0, limit);
    };

    const getAllStocks = () => {
        return stocks;
    };

    const getLeaderboard = async () => {
        return await stockCacheService.getLeaderboard();
    };

    const value = {
        stocks,
        loading,
        error,
        lastUpdated,
        loadStockData,
        refreshStockData,
        getStockByTicker,
        getStocksBySector,
        getTopGainers,
        getTopLosers,
        getPopularStocks,
        getAllStocks,
        getLeaderboard,
        portfolioData,
        portfolioLoading,
        portfolioError,
        loadPortfolioData,
        refreshPortfolioData,
        calculatedPortfolio,
        getPortfolioSummary
    };

    return (
        <StockContext.Provider value={value}>
            {children}
        </StockContext.Provider>
    );
};
