import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <a href="mailto:contact@stocksim.com">Email Us</a>
                    <a href="/about">About Us</a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <span>&copy; {currentYear} StockSim. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;