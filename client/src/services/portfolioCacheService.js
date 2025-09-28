import api from '../api/api.js';

const PORTFOLIO_CACHE_KEY = 'portfolio_data_cache';
const PORTFOLIO_CACHE_EXPIRY_KEY = 'portfolio_cache_expiry';
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

class PortfolioCacheService {
    constructor() {
        this.cache = this.loadFromCache();
        this.isLoading = false;
        this.loadingPromise = null;
    }

    // Load cached data from localStorage
    loadFromCache() {
        try {
            const cachedData = localStorage.getItem(PORTFOLIO_CACHE_KEY);
            const expiry = localStorage.getItem(PORTFOLIO_CACHE_EXPIRY_KEY);
            
            if (cachedData && expiry && Date.now() < parseInt(expiry)) {
                return JSON.parse(cachedData);
            }
            return null;
        } catch (error) {
            console.error('Error loading portfolio cache:', error);
            return null;
        }
    }

    // Save data to localStorage
    saveToCache(data) {
        try {
            localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(PORTFOLIO_CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
        } catch (error) {
            console.error('Error saving portfolio cache:', error);
        }
    }

    // Check if cache is valid
    isCacheValid() {
        const expiry = localStorage.getItem(PORTFOLIO_CACHE_EXPIRY_KEY);
        return expiry && Date.now() < parseInt(expiry);
    }

    // Get portfolio data from API
    async fetchPortfolioData() {
        try {
            const response = await api.get('/api/view-simulator-user/');
            return response.data;
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
            throw error;
        }
    }

    // Get portfolio data (from cache or API)
    async getPortfolioData(forceRefresh = false) {
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
        this.loadingPromise = this.fetchPortfolioData()
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

    // Clear cache
    clearCache() {
        localStorage.removeItem(PORTFOLIO_CACHE_KEY);
        localStorage.removeItem(PORTFOLIO_CACHE_EXPIRY_KEY);
        this.cache = null;
    }

    // Force refresh cache
    async refreshCache() {
        this.clearCache();
        return await this.getPortfolioData(true);
    }
}

// Create singleton instance
const portfolioCacheService = new PortfolioCacheService();

export default portfolioCacheService;
