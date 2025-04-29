import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.module.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">QuickMarkets</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/startSimulator">Simulation Modes</Link>
                </li>
                <li>
                    <Link to="/">Home</Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;