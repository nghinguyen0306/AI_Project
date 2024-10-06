"use client"; 
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import "../../styles/login.css";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter(); 

    const handleSubmit = (event) => {
        event.preventDefault();
    
        const savedEmail = localStorage.getItem("userEmail");
        const savedPassword = localStorage.getItem("userPassword");
    
        if (email === savedEmail && password === savedPassword) {
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("userEmail", email);

            
            const loginContainer = document.querySelector('.login-container');
            loginContainer.classList.add('fade-out');

            
            setTimeout(() => {
                router.push('/upload');
            }, 500);
        } else {
            alert('Invalid login credentials. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <main>
                <div className="welcome-message">
                    <h2>Welcome Back</h2>
                </div>

                <button id="google-signin-btn">
                    <img src="/images/Google__G__logo.svg (1).png" alt="Google Logo" className="google-logo" />
                    Continue with Google
                </button>

                <div className="separator">
                    <span>OR</span>
                </div>

                <form id="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" id="signin-btn">Sign in</button>
                </form>
                <div className="signup-link">
                    <span>
                        Don't have an account? <a href="/signup">Sign up</a>
                    </span>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
