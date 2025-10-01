import React, { useState, useEffect } from 'react';
import styles from './StockModal.module.css';
import { IoClose } from "react-icons/io5";
import { FaArrowUp, FaArrowDown, FaBookmark, FaRegBookmark } from "react-icons/fa";
import api from '../../../../api/api.js';
import { useStockData } from '../../../../contexts/StockContext';
import StockChart from '../../../../components/StockChart';

const StockModal = ({ stock, onClose, onTransactionComplete }) => {
    const [shares, setShares] = useState('');
    const [transactionType, setTransactionType] = useState('buy');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [watchlistLoading, setWatchlistLoading] = useState(false);
    const [returnData, setReturnData] = useState({
        oneWeek: 0,
        oneMonth: 0,
        threeMonth: 0,
        sixMonth: 0
    });
    const [returnsLoading, setReturnsLoading] = useState(true);

    const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useStockData();

    // Fetch return data when modal opens
    useEffect(() => {
        const fetchReturnData = async () => {
            if (!stock?.symbol) return;
            
            setReturnsLoading(true);
            try {
                const response = await api.get(`/api/stock-returns/?ticker=${stock.symbol}`);
                setReturnData(response.data.returns);
            } catch (error) {
                console.error('Error fetching return data:', error);
                // Set default values on error
                setReturnData({
                    oneWeek: 0,
                    oneMonth: 0,
                    threeMonth: 0,
                    sixMonth: 0
                });
            } finally {
                setReturnsLoading(false);
            }
        };

        fetchReturnData();
    }, [stock?.symbol]);

    if (!stock) return null;

    const handleTransaction = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!shares || shares <= 0) {
            setError('Please enter a valid number of shares');
            setLoading(false);
            return;
        }

        try {
            const endpoint = transactionType === 'buy' ? '/api/buy-stock/' : '/api/sell-stock/';
            const response = await api.post(endpoint, {
                ticker: stock.symbol,
                shares: parseFloat(shares)
            });

            // Clear form and show success
            setShares('');
            setError('');
            
            if (onTransactionComplete) {
                onTransactionComplete(response.data);
            }
            
            setTimeout(() => {
                onClose();
            }, 1500);

        } catch (error) {
            setError(error.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    const handleWatchlistToggle = async () => {
        setWatchlistLoading(true);
        try {
            if (isInWatchlist(stock.symbol)) {
                await removeFromWatchlist(stock.symbol);
            } else {
                await addToWatchlist(stock.symbol);
            }
        } catch (error) {
            console.error('Error toggling watchlist:', error);
        } finally {
            setWatchlistLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h1>Stock Overview</h1>
                    <div className={styles.headerActions}>
                        <button 
                            className={styles.watchlistButton} 
                            onClick={handleWatchlistToggle}
                            disabled={watchlistLoading}
                            title={isInWatchlist(stock.symbol) ? "Remove from watchlist" : "Add to watchlist"}
                        >
                            {isInWatchlist(stock.symbol) ? <FaBookmark size={20} /> : <FaRegBookmark size={20} />}
                        </button>
                        <button className={styles.closeButton} onClick={onClose}>
                            <IoClose size={24} />
                        </button>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.mainContent}>
                        <div className={styles.priceSection}>
                            <div className={styles.stockInfo}>
                                <div className={styles.stockHeader}>
                                    <div className={styles.stockLogo}>
                                        <div className={styles.logoPlaceholder}>
                                            {stock.symbol.slice(0, 2)}
                                        </div>
                                    </div>
                                    <div className={styles.stockTitle}>
                                        <h2>{stock.symbol}</h2>
                                        <h3>{stock.name}</h3>
                                    </div>
                                </div>
                                <div className={styles.priceInfo}>
                                    <span className={styles.price}>${stock.currentPrice.toFixed(2)}</span>
                                    <span className={stock.currentPrice >= stock.openingPrice ? styles.positive : styles.negative}>
                                        {stock.currentPrice >= stock.openingPrice ? <FaArrowUp /> : <FaArrowDown />}
                                        {Math.abs(((stock.currentPrice - stock.openingPrice) / stock.openingPrice * 100)).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.statsSection}>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>Sector Type</span>
                                    <span className={styles.value}>{stock.sector || 'N/A'}</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>Current Price</span>
                                    <span className={styles.value}>${stock.currentPrice.toFixed(2)}</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>1 Week Return</span>
                                    <span className={`${styles.value} ${returnData.oneWeek >= 0 ? styles.positive : styles.negative}`}>
                                        {returnsLoading ? 'Loading...' : `${returnData.oneWeek >= 0 ? '+' : ''}${returnData.oneWeek.toFixed(2)}%`}
                                    </span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>1 Month Return</span>
                                    <span className={`${styles.value} ${returnData.oneMonth >= 0 ? styles.positive : styles.negative}`}>
                                        {returnsLoading ? 'Loading...' : `${returnData.oneMonth >= 0 ? '+' : ''}${returnData.oneMonth.toFixed(2)}%`}
                                    </span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>3 Month Return</span>
                                    <span className={`${styles.value} ${returnData.threeMonth >= 0 ? styles.positive : styles.negative}`}>
                                        {returnsLoading ? 'Loading...' : `${returnData.threeMonth >= 0 ? '+' : ''}${returnData.threeMonth.toFixed(2)}%`}
                                    </span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>6 Month Return</span>
                                    <span className={`${styles.value} ${returnData.sixMonth >= 0 ? styles.positive : styles.negative}`}>
                                        {returnsLoading ? 'Loading...' : `${returnData.sixMonth >= 0 ? '+' : ''}${returnData.sixMonth.toFixed(2)}%`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.transactionSection}>
                            <h3>Trade {stock.symbol}</h3>
                            <form onSubmit={handleTransaction} className={styles.transactionForm}>
                                <div className={styles.transactionTypeToggle}>
                                    <button
                                        type="button"
                                        className={`${styles.toggleButton} ${transactionType === 'buy' ? styles.active : ''}`}
                                        onClick={() => setTransactionType('buy')}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        type="button"
                                        className={`${styles.toggleButton} ${transactionType === 'sell' ? styles.active : ''}`}
                                        onClick={() => setTransactionType('sell')}
                                    >
                                        Sell
                                    </button>
                                </div>
                                
                                <div className={styles.sharesInput}>
                                    <label htmlFor="shares">Number of Shares:</label>
                                    <input
                                        id="shares"
                                        type="number"
                                        step="0.0001"
                                        min="0.0001"
                                        value={shares}
                                        onChange={(e) => setShares(e.target.value)}
                                        placeholder="Enter shares"
                                        required
                                    />
                                </div>

                                {shares && (
                                    <div className={styles.transactionSummary}>
                                        <p>Total {transactionType === 'buy' ? 'Cost' : 'Value'}: 
                                            <span className={styles.totalAmount}>
                                                ${(parseFloat(shares || 0) * stock.currentPrice).toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                {error && (
                                    <div className={styles.errorMessage}>
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className={`${styles.transactionButton} ${transactionType === 'buy' ? styles.buyButton : styles.sellButton}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : `${transactionType === 'buy' ? 'Buy' : 'Sell'} ${stock.symbol}`}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className={styles.chartSection}>
                        <StockChart 
                            ticker={stock.symbol} 
                            stockName={stock.name}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockModal;
