import api from '../api/api.js';

const STOCK_CACHE_KEY = 'stock_prices_cache';
const CACHE_EXPIRY_KEY = 'stock_cache_expiry';
const CACHE_DURATION = 5 * 1000; // 5 seconds

class StockCacheService {
    constructor() {
        this.cache = this.loadFromCache();
        this.isLoading = false;
        this.loadingPromise = null;
    }

    // Load cached data from localStorage
    loadFromCache() {
        try {
            const cachedData = localStorage.getItem(STOCK_CACHE_KEY);
            const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
            
            if (cachedData && expiry && Date.now() < parseInt(expiry)) {
                return JSON.parse(cachedData);
            }
            return null;
        } catch (error) {
            console.error('Error loading stock cache:', error);
            return null;
        }
    }

    // Save data to localStorage
    saveToCache(data) {
        try {
            localStorage.setItem(STOCK_CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
        } catch (error) {
            console.error('Error saving stock cache:', error);
        }
    }

    // Check if cache is valid
    isCacheValid() {
        const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
        return expiry && Date.now() < parseInt(expiry);
    }

    // Get stock prices from API
    async fetchStockPrices() {
        try {
            const response = await api.get('/api/view-stock-prices/');
            return response.data;
        } catch (error) {
            console.error('Error fetching stock prices:', error);
            throw error;
        }
    }

    // Get stock prices (from cache or API)
    async getStockPrices(forceRefresh = false) {
        // Return cached data if available and not forcing refresh
        if (!forceRefresh && this.cache && this.isCacheValid()) {
            return this.cache;
        }

        // If already loading, return the existing promise
        if (this.isLoading && this.loadingPromise) {
            return this.loadingPromise;
        }

        // Start loading
        this.isLoading = true;
        this.loadingPromise = this.fetchStockPrices()
            .then(data => {
                this.cache = data;
                this.saveToCache(data);
                this.isLoading = false;
                this.loadingPromise = null;
                return data;
            })
            .catch(error => {
                this.isLoading = false;
                this.loadingPromise = null;
                throw error;
            });

        return this.loadingPromise;
    }

    // Get a specific stock by ticker
    async getStockByTicker(ticker) {
        const stocks = await this.getStockPrices();
        return stocks.find(stock => stock.ticker === ticker);
    }

    // Get stocks by sector
    async getStocksBySector(sectorTicker) {
        const stocks = await this.getStockPrices();
        return stocks.filter(stock => stock.sectorType === sectorTicker);
    }


    // Clear cache
    clearCache() {
        localStorage.removeItem(STOCK_CACHE_KEY);
        localStorage.removeItem(CACHE_EXPIRY_KEY);
        this.cache = null;
    }

    // Force refresh cache
    async refreshCache() {
        this.clearCache();
        return await this.getStockPrices(true);
    }

}

// Create singleton instance
const stockCacheService = new StockCacheService();

export default stockCacheService;
