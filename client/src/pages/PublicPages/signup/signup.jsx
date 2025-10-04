import { useState } from "react";
import Navbar from "../components/navBar/navBar.jsx";
import QuickMarketsImage from "./img/QuickMarketsImg.png";
import { FaUser, FaLock, FaExclamationTriangle } from 'react-icons/fa';
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
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    // Password validation function
    const validatePassword = (password) => {
        const errors = [];
        
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }
        
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push("Password must contain at least one special character");
        }
        
        return errors;
    };

    // Form validation function
    const validateForm = () => {
        const newErrors = [];
        
        if (!email.trim()) {
            newErrors.push("Email is required");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.push("Please enter a valid email address");
        }
        
        if (!username.trim()) {
            newErrors.push("Username is required");
        } else if (username.length < 3) {
            newErrors.push("Username must be at least 3 characters long");
        }
        
        if (!password.trim()) {
            newErrors.push("Password is required");
        } else {
            const passwordErrors = validatePassword(password);
            newErrors.push(...passwordErrors);
        }
        
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        
        // Validate form
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setLoading(true);

        try {
            const res = await api.post(route + "/", { email, username, password })
            navigate("/login")
        } catch (error) {
            // Handle different types of errors
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'object' && errorData.error) {
                    setErrors([errorData.error]);
                } else if (typeof errorData === 'string') {
                    setErrors([errorData]);
                } else {
                    setErrors(["An error occurred during registration"]);
                }
            } else {
                setErrors(["An error occurred during registration"]);
            }
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
                    
                    {/* Error Display */}
                    {errors.length > 0 && (
                        <div className={Styles.errorContainer}>
                            <FaExclamationTriangle className={Styles.errorIcon} />
                            <div className={Styles.errorList}>
                                {errors.map((error, index) => (
                                    <div key={index} className={Styles.errorItem}>
                                        {error}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
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