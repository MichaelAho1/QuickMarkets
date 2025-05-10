import React, { useEffect } from 'react';
import styles from './landing.module.css';
import Navbar from "../components/navBar/navBar.jsx";
import Footer from "../components/footer/footer.jsx";
import SimulatorGraphics from "./img/SimulatorGraphics.png";
import CashImage from "./img/Cash.png";
import FastImage from "./img/Fast.png";
import Leaderboard from "./img/Leaderboard.png";

function landing() {
    return (
        <>
            <Navbar />
            <div className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <h1>QuickMarkets Stock Simulator</h1>
                    <p>Experience accelerated stock trading in a risk-free environment.</p>
                    <button className={styles.heroButton}>Join For Free</button>
                </div>
            </div>
            <section>
                <div className={styles.welcomeCard}>
                    <div className={styles.descriptionSection}>
                        <h1>Welcome to QuickMarkets</h1>
                        <p>
                            Accelerate your understanding of stock investing with QuickMarkets. Our simulator offers a realistic, fast-paced environment where you can quickly learn market dynamics.
                        </p>
                    </div>
                    <img src={SimulatorGraphics} alt="Simulator Graphics"></img>
                </div>
                <div className={styles.featureCards}>
                    <div className={styles.featureCard}>
                        <img src={FastImage} alt="Feauture Image"></img>
                        <h1>Accelerated Trading Days</h1>
                        <p>Trade at lightning speed! Each 5-minute interval simulates a complete trading day, allowing for quick learning and efficient strategy evaluation.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <img src={Leaderboard} alt="Feauture Image"></img>
                        <h1>Competitive Leaderbaords</h1>
                        <p>Compete with the community! Climb the ranks, challenge your peers, and prove your trading skills.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <img src={CashImage} alt="Feauture Image"></img>
                        <h1>Cash Prizes</h1>
                        <p>Coming Soon...</p>
                    </div>
                </div>
                <button className={styles.startButton}>Learn More</button>
            </section>
            <Footer />
        </>
    );
}

export default landing;