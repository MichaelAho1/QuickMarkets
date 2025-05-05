import React from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./exploreStocks.module.css";

function exploreStocks() {
    return (
        <div className={styles.exploreStocks}>
            <Navbar />
            <h1>Welcome to the exploreStocks</h1>
        </div>
    );
}

export default exploreStocks;