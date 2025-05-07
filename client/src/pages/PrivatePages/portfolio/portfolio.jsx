import React, { useState } from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./portfolio.module.css";

function stocksOwned() {
    const [portfolioValue, setPortfolioValue] = useState([1,374.85])

    return (
        <div className={styles.portfolio}> 
            <Navbar />
            <header>
                <h1>Total Portfolio Value</h1>
                <h2>{portfolioValue}</h2>
            </header>
            
        </div>
        
    );
}

export default stocksOwned;