import api from '../api/api.js';

const SIMULATION_TIME_CACHE_KEY = 'simulation_time_cache';
const SIMULATION_TIME_CACHE_EXPIRY_KEY = 'simulation_time_cache_expiry';
const CACHE_DURATION = 4 * 1000; // 4 seconds (shorter than 5-second interval)

class SimulationTimeCacheService {
    constructor() {
        this.cache = this.loadFromCache();
        this.isLoading = false;
        this.loadingPromise = null;
    }

    // Load cached data from localStorage
    loadFromCache() {
        try {
            const cachedData = localStorage.getItem(SIMULATION_TIME_CACHE_KEY);
            const expiry = localStorage.getItem(SIMULATION_TIME_CACHE_EXPIRY_KEY);
            
            if (cachedData && expiry && Date.now() < parseInt(expiry)) {
                return JSON.parse(cachedData);
            }
            return null;
        } catch (error) {
            console.error('Error loading simulation time cache:', error);
            return null;
        }
    }

    // Save data to localStorage
    saveToCache(data) {
        try {
            localStorage.setItem(SIMULATION_TIME_CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(SIMULATION_TIME_CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
        } catch (error) {
            console.error('Error saving simulation time cache:', error);
        }
    }

    // Check if cache is valid
    isCacheValid() {
        const expiry = localStorage.getItem(SIMULATION_TIME_CACHE_EXPIRY_KEY);
        return expiry && Date.now() < parseInt(expiry);
    }

    // Get simulation time from API
    async fetchSimulationTime() {
        try {
            const response = await api.get('/api/simulation-time/');
            return {
                currentDay: response.data.current_day,
                timeUntilNextDay: response.data.time_until_next_day
            };
        } catch (error) {
            console.error('Error fetching simulation time:', error);
            throw error;
        }
    }

    // Get simulation time (from cache or API)
    async getSimulationTime(forceRefresh = false) {
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
        this.loadingPromise = this.fetchSimulationTime()
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
        localStorage.removeItem(SIMULATION_TIME_CACHE_KEY);
        localStorage.removeItem(SIMULATION_TIME_CACHE_EXPIRY_KEY);
        this.cache = null;
    }

    // Force refresh cache
    async refreshCache() {
        this.clearCache();
        return await this.getSimulationTime(true);
    }
}

// Create singleton instance
const simulationTimeCacheService = new SimulationTimeCacheService();

export default simulationTimeCacheService;
