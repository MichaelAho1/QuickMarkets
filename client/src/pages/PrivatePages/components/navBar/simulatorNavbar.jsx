import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './simulatorNavbar.module.css';
import logo from '../../../../assets/logo.png';
import { MdOutlineDashboard } from "react-icons/md";
import { BsPiggyBank } from "react-icons/bs";
import { AiOutlineStock } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosArrowDown, IoMdMenu } from "react-icons/io";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../../api/constants';
import { useStockData } from '../../../../contexts/StockContext'; 

const Navbar = () => {
    const [isWatchlistCollapsed, setIsWatchlistCollapsed] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const { 
        getWatchlistStocks, 
        watchlistLoading, 
        watchlistError 
    } = useStockData();

    const toggleWatchlist = () => {
        setIsWatchlistCollapsed(!isWatchlistCollapsed);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleLogout = () => {
        // Clear tokens from localStorage
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        
        // Close dropdown
        setIsProfileDropdownOpen(false);
        
        // Navigate to login page
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        if (isProfileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileDropdownOpen]);


    const watchlistStocks = getWatchlistStocks();

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
                                <Link to="/admin/portfolio">My Stocks</Link>
                            </p>
                            <p className={styles.navBarItem}>
                                <AiOutlineStock />
                                <Link to="/admin/exploreStocks">Explore Stocks</Link>
                            </p>
                        </div>
                    </div>
                    <div className={styles.watchList}>
                        <p className={styles.navBarHeader} onClick={toggleWatchlist}>
                            <span className={styles.watchListTitle}>WATCHLIST ({watchlistStocks.length}/5)</span>
                            <IoIosArrowDown className={`${styles.caret} ${isWatchlistCollapsed ? styles.collapsed : ''}`} />
                        </p>
                        <div className={`${styles.collapsibleContent} ${isWatchlistCollapsed ? styles.collapsed : ''}`}>
                            {watchlistLoading ? (
                                <div className={styles.watchlistLoading}>
                                    <span>Loading...</span>
                                </div>
                            ) : (
                                watchlistStocks.map((stock) => {
                                    const percentageChange = ((stock.currPrice - stock.prevPrice) / stock.prevPrice) * 100;
                                    const isPositive = percentageChange >= 0;
                                    
                                    return (
                                        <div className={styles.watchListItem} key={stock.ticker}>
                                            <div className={styles.stockInfo}>
                                                <span className={styles.symbol}>{stock.ticker}</span>
                                                <span className={styles.price}>${stock.currPrice.toFixed(2)}</span>
                                            </div>
                                            <div className={styles.stockActions}>
                                                <span className={isPositive ? styles.positiveChange : styles.negativeChange}>
                                                    {isPositive ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
                                                    {Math.abs(percentageChange).toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.userProfile} ref={dropdownRef}>
                    <img 
                        className={styles.userImg} 
                        src="www.hi" 
                        alt="User" 
                        onClick={toggleProfileDropdown}
                    />
                    <div>
                        <p className={styles.userName}>John Doe</p>
                        <p className={styles.userEmail}>john.doe@example.com</p>
                    </div>
                    {isProfileDropdownOpen && (
                        <div className={styles.profileDropdown}>
                            <button 
                                className={styles.logoutButton}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;
