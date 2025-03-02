import React from 'react';
import styles from './graphSection.module.css';

const graphSection = () => {
    return (
        <>
        <div className={styles.header}>
            <h1 className={styles.title}>Top50 <span className={styles.price}>$7,352.05</span></h1>
        </div>
        <div className={styles.headerDescription}>
            <h3><span className={styles.yearTotal}>+105.55</span>% Past Year</h3>
        </div>
        </>
    );
};


export default graphSection;