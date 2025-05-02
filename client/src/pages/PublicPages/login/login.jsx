import React from 'react';
import Navbar from "../components/navBar/navBar.jsx";
import QuickMarketsImage from "./img/QuickMarketsImg.png";
import Styles from "./login.module.css";
import { FaUser, FaLock } from 'react-icons/fa';

function login() {
    return (
        <div>
            <Navbar />
            <section className={Styles.loginSection}>
                <img className={Styles.leftSide} src={QuickMarketsImage} alt="QuickMarkets Image"></img>
                <div className={Styles.rightSide}>
                    <header className={Styles.header}>
                        <h1>Log In</h1>
                        <p>Log In To start Trading</p>
                    </header>
                    <form className={Styles.form}>
                        <div className={Styles.usernameSection}>
                            <label htmlFor="username">Username</label>
                            <div className={Styles.inputContainer}>
                                <FaUser className={Styles.inputIcon} />
                                <input id="username" type="text" aria-label="Username" placeholder="Enter Username" />
                            </div>
                        </div>
                        <div className={Styles.passwordSection}>
                            <label htmlFor="password">Password</label>
                            <div className={Styles.inputContainer}>
                                <FaLock className={Styles.inputIcon} />
                                <input id="password" type="password" aria-label="Password" placeholder="Enter Password" />
                            </div>
                        </div>
                        <button className={Styles.submitButton} type="submit">Log In</button>
                    </form>
                    <p className={Styles.signUpPrompt}>Don't have an account? <a href="/signup">Sign Up</a></p>
                </div>
            </section>
        </div>
    );
}

export default login;