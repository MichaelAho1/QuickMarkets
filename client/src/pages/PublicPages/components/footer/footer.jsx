import React from 'react';
import styles from './footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerSection}>
                    <a href="mailto:quickmarketz.contact@gmail.com">Email Us</a>
                    <a href="https://www.linkedin.com/company/quickmarketz/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <span>&copy; {currentYear} QuickMarketz. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;