import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './navBar.module.css';
import RisingStockImg from '../../../../assets/logo.png';
import { ACCESS_TOKEN } from '../../../../api/constants.js';

const NavBar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            setIsAuthenticated(!!token);
        };

        checkAuth();

        // Wait for storage changes (login/logout)
        const handleStorageChange = (e) => {
            if (e.key === ACCESS_TOKEN) {
                checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
<nav className={styles.navbar}>
    <div className={styles.navbarLeft}>
        <img src={RisingStockImg} alt="Logo" className={styles.logo} />
        <h1>QuickMarketz</h1>
    </div>
    <div className={styles.navbarRight}>
        <p className={styles.navbarItem}>
            <Link to="/">Home</Link>
        </p>
        {isAuthenticated ? (
            <p className={styles.navbarItem}>
                <Link to="/admin">Simulator Dashboard</Link>
            </p>
        ) : (
            <p className={styles.navbarItem}>
                <Link to="/login">Login</Link>
            </p>
        )}
    </div>
</nav>
    );
};

export default NavBar;