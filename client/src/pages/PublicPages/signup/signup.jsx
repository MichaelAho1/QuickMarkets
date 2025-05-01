import React, { useEffect } from 'react';
import Navbar from "../../../components/navBar/navBar.jsx";
import QuickMarketsImage from "./img/QuickMarketsImg.png";
import Styles from "./signup.module.css";
import { FaUser, FaLock } from 'react-icons/fa';

function signup() {
    return (
        <div className={Styles.all}>
            <Navbar />
            <section className={Styles.loginSection}>
                <img className={Styles.leftSide} src={QuickMarketsImage} alt="QuickMarkets Image"></img>
                <div className={Styles.rightSide}>
                    <header className={Styles.header}>
                        <h1>Sign Up</h1>
                        <p>Sign Up To start Trading</p>
                    </header>
                    <form className={Styles.form}>
                        <div className={Styles.formSection}>
                            <label htmlFor="email">Email</label>
                            <div className={Styles.inputContainer}>
                                <FaUser className={Styles.inputIcon} />
                                <input id="email" type="text" aria-label="Email" placeholder="Enter your Email" />
                            </div>
                        </div>
                        <div className={Styles.formSection}>
                            <label htmlFor="username">Username</label>
                            <div className={Styles.inputContainer}>
                                <FaUser className={Styles.inputIcon} />
                                <input id="username" type="text" aria-label="Username" placeholder="Create a Username" />
                            </div>
                        </div>
                        <div className={Styles.formSection}>
                            <label htmlFor="password">Password</label>
                            <div className={Styles.inputContainer}>
                                <FaLock className={Styles.inputIcon} />
                                <input id="password" type="password" aria-label="Password" placeholder="Create a Password" />
                            </div>
                        </div>
                        <div className={Styles.formSection}>
                            <label htmlFor="password">Confirm Password</label>
                            <div className={Styles.inputContainer}>
                                <FaLock className={Styles.inputIcon} />
                                <input id="confirmPassword" type="password" aria-label="ConfirmPassword" placeholder="Confirm Password" />
                            </div>
                        </div>
                        <button className={Styles.submitButton} type="submit">Sign Up</button>
                    </form>
                    <p className={Styles.signUpPrompt}>Already have an account? <a href="/login">Log In</a></p>
                </div>
            </section>
        </div>
    );
}

export default signup;