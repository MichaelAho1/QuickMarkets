import React from 'react';
import styles from './StockModal.module.css';
import { IoClose } from "react-icons/io5";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StockModal = ({ stock, onClose }) => {
    if (!stock) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <div className={styles.stockInfo}>
                        <h1>{stock.symbol}</h1>
                        <h2>{stock.name}</h2>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <IoClose size={24} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.priceSection}>
                        <div className={styles.currentPrice}>
                            <span className={styles.price}>${stock.price.toFixed(2)}</span>
                            <span className={stock.change >= 0 ? styles.positive : styles.negative}>
                                {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                {Math.abs(stock.change)}%
                            </span>
                        </div>
                        <div className={styles.priceDetails}>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Open</span>
                                <span className={styles.value}>${(stock.price * 0.98).toFixed(2)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>High</span>
                                <span className={styles.value}>${(stock.price * 1.02).toFixed(2)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Low</span>
                                <span className={styles.value}>${(stock.price * 0.97).toFixed(2)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Volume</span>
                                <span className={styles.value}>{(Math.random() * 10000000).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.chartSection}>
                        <div className={styles.chartPlaceholder}>
                            <p>Stock Chart Coming Soon</p>
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <div className={styles.infoCard}>
                            <h3>Company Overview</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        </div>
                        <div className={styles.infoCard}>
                            <h3>Key Statistics</h3>
                            <div className={styles.statsGrid}>
                                <div className={styles.statItem}>
                                    <span className={styles.label}>Market Cap</span>
                                    <span className={styles.value}>${(Math.random() * 1000000000000).toLocaleString()}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.label}>P/E Ratio</span>
                                    <span className={styles.value}>{(Math.random() * 50).toFixed(2)}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.label}>EPS</span>
                                    <span className={styles.value}>${(Math.random() * 10).toFixed(2)}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.label}>Dividend Yield</span>
                                    <span className={styles.value}>{(Math.random() * 5).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockModal;
