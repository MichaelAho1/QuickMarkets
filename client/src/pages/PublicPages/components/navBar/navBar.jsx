import React from 'react';
import { Link } from 'react-router-dom';
import styles from './navBar.module.css';
import RisingStockImg from '../../../../assets/logo.png';

const NavBar = () => {
    return (
<nav className={styles.navbar}>
    <div className={styles.navbarLeft}>
        <img src={RisingStockImg} alt="Logo" className={styles.logo} />
        <h1>QuickMarkets</h1>
    </div>
    <div className={styles.navbarRight}>
        <p className={styles.navbarItem}>
            <Link to="/">Home</Link>
        </p>
        <p className={styles.navbarItem}>
            <Link to="/startSimulator">Simulator Dashboard</Link>
        </p>
        <p className={styles.navbarItem}>
            <Link to="/login">Login</Link>
        </p>
    </div>
</nav>
    );
};

export default NavBar;