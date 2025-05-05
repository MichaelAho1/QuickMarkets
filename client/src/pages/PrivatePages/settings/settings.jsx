import React from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./settings.module.css"

function settings() {
    return (
        <div className={styles.settings}>
            <Navbar />
            <h1>Welcome to the settings</h1>
        </div>
    );
}

export default settings;