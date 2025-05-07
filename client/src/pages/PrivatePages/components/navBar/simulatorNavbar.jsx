import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './simulatorNavbar.module.css';
import logo from '../../../../assets/logo.png';
import { MdOutlineDashboard } from "react-icons/md";
import { BsPiggyBank } from "react-icons/bs";
import { AiOutlineStock } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosArrowDown, IoMdMenu } from "react-icons/io"; 

const Navbar = () => {
    const [isWatchlistCollapsed, setIsWatchlistCollapsed] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleWatchlist = () => {
        setIsWatchlistCollapsed(!isWatchlistCollapsed);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const stocks = [
        { symbol: 'AAPL', dayChangePercentage: 1.25 },
        { symbol: 'MSFT', dayChangePercentage: -0.78 },
        { symbol: 'TSLA', dayChangePercentage: 3.10 },
        { symbol: 'AMZN', dayChangePercentage: -2.15 },
        { symbol: 'GOOG', dayChangePercentage: 0.55 },
    ];

    return (
        <>
            <button className={styles.hamburgerButton} onClick={toggleSidebar}>
                <IoMdMenu className={styles.hamburgerIcon} />
            </button>

            <nav className={`${styles.navBar} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.navbarHeader}>
                    <img src={logo} alt="QuickMarkets Logo" />
                    <h1 className={styles.headerName}>
                        <Link to="/">QuickMarkets</Link>
                    </h1>
                </div>
                <div className={styles.navBarContent}>
                    <div className={styles.mainNavLinks}>
                        <div className={styles.mainNavTop}>
                            <p className={styles.navBarHeader}>MAIN MENU</p>
                            <p className={styles.navBarItem}>
                                <MdOutlineDashboard />
                                <Link to="/admin">Dashboard</Link>
                            </p>
                            <p className={styles.navBarItem}>
                                <BsPiggyBank />
                                <Link to="/admin/portfolio">Portfolio</Link>
                            </p>
                            <p className={styles.navBarItem}>
                                <AiOutlineStock />
                                <Link to="/admin/exploreStocks">Stocks</Link>
                            </p>
                        </div>
                    </div>
                    <div className={styles.watchList}>
                        <p className={styles.navBarHeader} onClick={toggleWatchlist}>
                            <span className={styles.watchListTitle}>WATCHLIST</span>
                            <IoIosArrowDown className={`${styles.caret} ${isWatchlistCollapsed ? styles.collapsed : ''}`} />
                        </p>
                        <div className={`${styles.collapsibleContent} ${isWatchlistCollapsed ? styles.collapsed : ''}`}>
                            {stocks.map((stock) => (
                                <div className={styles.watchListItem} key={stock.symbol}>
                                    <span>{stock.symbol}</span>
                                    <span className={stock.dayChangePercentage >= 0 ? styles.positiveChange : styles.negativeChange}>
                                        {stock.dayChangePercentage >= 0 ? '+' : ''}{stock.dayChangePercentage.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.userProfile}>
                    <img className={styles.userImg} src="www.hi" alt="User" />
                    <div>
                        <p className={styles.userName}>John Doe</p>
                        <p className={styles.userEmail}>john.doe@example.com</p>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
