import React from 'react';
import styles from './newsCard.module.css';

const NewsCard = () => {
    const newsItems = [
        {
            id: 1,
            title: "Tech Stocks Rally on Strong Earnings",
            source: "Financial Times",
            time: "2h ago"
        },
        {
            id: 2,
            title: "Federal Reserve Signals Rate Cut",
            source: "Bloomberg",
            time: "4h ago"
        },
        {
            id: 3,
            title: "New AI Technology Boosts Market Confidence",
            source: "Wall Street Journal",
            time: "6h ago"
        }
    ];

    return (
        <div className={styles.newsCard}>
            <h2>Market News</h2>
            <div className={styles.newsList}>
                {newsItems.map((news) => (
                    <div key={news.id} className={styles.newsItem}>
                        <h3>{news.title}</h3>
                        <div className={styles.newsMeta}>
                            <span>{news.source}</span>
                            <span>{news.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsCard;
