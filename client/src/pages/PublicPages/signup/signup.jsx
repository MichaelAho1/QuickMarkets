import { useState } from "react";
import Navbar from "../components/navBar/navBar.jsx";
import QuickMarketsImage from "./img/QuickMarketsImg.png";
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../../api/constants.js";
import api from "../../../api/api.js";
import Styles from "./signup.module.css";

function signup() {
    let route="/api/user/register" 
    let method="register"

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post(route + "/", { email, username, password })
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
        <div className={Styles.all}>
            <Navbar />
            <section className={Styles.loginSection}>
                <img className={Styles.leftSide} src={QuickMarketsImage} alt="QuickMarkets Image"></img>
                <div className={Styles.rightSide}>
                    <header className={Styles.header}>
                        <h1>Sign Up</h1>
                        <p>Sign Up To start Trading</p>
                    </header>
                    <form onSubmit={handleSubmit} className={Styles.form}>
                        <div className={Styles.formSection}>
                            <label htmlFor="email">Email</label>
                            <div className={Styles.inputContainer}>
                                <FaUser className={Styles.inputIcon} />
                                <input 
                                    id="email" 
                                    value={email}
                                    type="text" 
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email" 
                                />
                            </div>
                        </div>
                        <div className={Styles.formSection}>
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
                        <div className={Styles.formSection}>
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
                        <button className={Styles.submitButton} type="submit">Sign Up</button>
                    </form>
                    <p className={Styles.signUpPrompt}>Already have an account? <a href="/login">Log In</a></p>
                </div>
            </section>
        </div>
    );
}

export default signup;