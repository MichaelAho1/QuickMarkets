import React, { useState, useEffect } from 'react';
import styles from './nav.module.css';
import marketIcon from './assets/Market.png';
import portfolioIcon from './assets/Portfolio.png';
import bankIcon from './assets/Bank.png';
import settingsIcon from './assets/Settings.png';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {isMobile && (
                <button className={styles.menuButton} onClick={toggleMenu}>

                </button>
            )}

            <div className={`${styles.navContainer} ${isOpen ? styles.open : ''}`}>
                <button className={styles.navButton}>
                    <img className={styles.icons} src={marketIcon} alt="Market" width="100" height="100"/>
                </button>
                <button className={styles.navButton}>
                    <img className={styles.icons} src={portfolioIcon} alt="Portfolio" width="100" height="100"/>
                </button>
                <button className={styles.navButton}>
                    <img className={styles.icons} src={bankIcon} alt="Bank" width="100" height="100"/>
                </button>
                <div className={styles.bottomNav}>
                    <button className={styles.navButton}>
                        <img className={styles.icons} src={settingsIcon} alt="Settings" width="100" height="100"/>
                    </button>
                </div>
            </div>
        </>
    );
};

export default NavBar;