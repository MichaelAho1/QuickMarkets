import React from 'react';
import Navbar from "../components/navBar/simulatorNavbar.jsx";
import styles from "./dashboard.module.css";

function Dashboard() {
    return (
        <main className={styles.dashboard}>
            <Navbar />
            <h1>Welcome to the Dashboard</h1>
        </main>
    );
}

export default Dashboard;