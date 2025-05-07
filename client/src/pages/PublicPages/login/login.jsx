import { useState } from "react";
import Navbar from "../components/navBar/navBar.jsx";
import QuickMarketsImage from "./img/QuickMarketsImg.png";
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../api/constants.js";
import api from "../../../api/api.js";
import Styles from "./login.module.css";

function login() {
    let route="/api/token";
    let method="login"
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route + "/", { username, password })
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };

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
                    <form onSubmit={handleSubmit} className={Styles.form}>
                        <div className={Styles.usernameSection}>
                            <label htmlFor="username">Username</label>
                            <div className={Styles.inputContainer}>
                                <FaUser className={Styles.inputIcon} />
                                <input 
                                    id="username" 
                                    value={username}
                                    type="text" 
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username" 
                                />
                            </div>
                        </div>
                        <div className={Styles.passwordSection}>
                            <label htmlFor="password">Password</label>
                            <div className={Styles.inputContainer}>
                                <FaLock className={Styles.inputIcon} />
                                <input 
                                    id="password" 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                />
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