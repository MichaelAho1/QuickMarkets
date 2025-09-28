import api from '../api/api.js';

class WatchlistService {
    async getWatchlist() {
        try {
            const response = await api.get('/api/watchlist/');
            return response.data;
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            throw error;
        }
    }

    async addToWatchlist(ticker) {
        try {
            const response = await api.post('/api/watchlist/', { ticker });
            return response.data;
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            throw error;
        }
    }

    async removeFromWatchlist(ticker) {
        try {
            const response = await api.delete('/api/watchlist/', { 
                data: { ticker } 
            });
            return response.data;
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            throw error;
        }
    }

    async isInWatchlist(ticker, watchlist) {
        return watchlist.some(item => item.ticker === ticker);
    }
}

const watchlistService = new WatchlistService();
export default watchlistService;
