import React, { createContext, useContext, useState, useEffect } from 'react';
import stockCacheService from '../services/stockCacheService.js';

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

    // Load stock data on mount
    useEffect(() => {
        loadStockData();
    }, []);

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
        getAllStocks
    };

    return (
        <StockContext.Provider value={value}>
            {children}
        </StockContext.Provider>
    );
};
