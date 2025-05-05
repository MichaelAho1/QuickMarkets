import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./portfolio.module.css";

function stocksOwned() {
    const [topHoldings, setTopHoldings] = useState([
        { symbol: 'AAPL', dayChangePercentage: 1.25, price: 172.45 },
        { symbol: 'MSFT', dayChangePercentage: -0.78, price: 319.12 },
        { symbol: 'TSLA', dayChangePercentage: 3.10, price: 245.88 },
        { symbol: 'AMZN', dayChangePercentage: -2.15, price: 134.67 },
        { symbol: 'GOOG', dayChangePercentage: 0.55, price: 122.34 },
    ]);

    return (
        <div className={styles.portfolio}> 
            <Navbar />
            <h1>Welcome to Portfolio</h1>
            
                      {/*
                        <section className={styles.topHoldings}>
                            <p className={styles.topHoldingItem}>Top Holdings:</p>
                            {topHoldings.map((stock, index) => (
                                <div key={index} className={styles.topHoldingItem}>
                                    <span className={styles.symbol}>{stock.symbol}</span>
                                    <div className={styles.prices}>
                                        <span className={styles.price}>${stock.price.toFixed(2)}</span>
                                        <h4 className={portfolioDayChange >= 0 ? styles.positiveChange : styles.negativeChange}>
                                            {portfolioDayChange >= 0 ? '+' : ''}
                                            {portfolioDayChange.toFixed(2)}% today
                                        </h4>
                                    </div>
                                </div>
                            ))} 
                        </section>
                        */}
        </div>
        
    );
}

export default stocksOwned;