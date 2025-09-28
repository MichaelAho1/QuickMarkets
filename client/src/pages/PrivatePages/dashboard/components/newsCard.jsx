import React from 'react';
import styles from './newsCard.module.css';

const NewsCard = () => {
    const newsItems = [
        {
            id: 1,
            title: "Placeholder",
            source: "Placeholder",
            time: ""
        },
        {
            id: 2,
            title: "Placeholder",
            source: "Placeholder",
            time: ""
        },
        {
            id: 3,
            title: "Placeholder",
            source: "Placeholder",
            time: ""
        }
    ];

    return (
        <div className={styles.newsCard}>
            <h2>Market News (Coming Soon)</h2>
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
