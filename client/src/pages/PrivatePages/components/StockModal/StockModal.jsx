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
                    <h1>Stock Overview</h1>
                    <button className={styles.closeButton} onClick={onClose}>
                        <IoClose size={24} />
                    </button>
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
                                    <span className={styles.price}>${stock.price.toFixed(2)}</span>
                                    <span className={stock.change >= 0 ? styles.positive : styles.negative}>
                                        {stock.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                        {Math.abs(stock.change)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.statsSection}>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>Opening Price</span>
                                    <span className={styles.value}>${(stock.price * 0.98).toFixed(2)}</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>Closing Price</span>
                                    <span className={styles.value}>${stock.price.toFixed(2)}</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>1 Week Return</span>
                                    <span className={styles.value}>{(Math.random() * 10 - 5).toFixed(2)}%</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>1 Month Return</span>
                                    <span className={styles.value}>{(Math.random() * 20 - 10).toFixed(2)}%</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>6 Month Return</span>
                                    <span className={styles.value}>{(Math.random() * 30 - 15).toFixed(2)}%</span>
                                </div>
                                <div className={styles.statCard}>
                                    <span className={styles.label}>1 Year Return</span>
                                    <span className={styles.value}>{(Math.random() * 50 - 25).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.chartSection}>
                        <div className={styles.chartPlaceholder}>
                            <p>Stock Chart Coming Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockModal;
