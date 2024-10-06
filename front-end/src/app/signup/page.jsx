"use client"; 
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../styles/signup.css"; 

const SignUpPage = () => {
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const router = useRouter() // Initialize router

  const handleSignUp = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);


    setSuccessMessage("Bạn đã đăng ký thành công. Vui lòng đăng nhập lại để tiếp tục.");
    setTimeout(() => {
      router.push("/login"); 
    }, 2000);
  };

  return (
    <div className="auth-container">
      <h2>Create New Account</h2>
      <button id="google-signin-btn"><img src="/images/Google__G__logo.svg (1).png" alt="Google Logo" className="google-logo" />
      Continue with Google</button>
      <div className="separator">
        <span>OR</span>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>} 
      <form onSubmit={handleSignUp} className="auth-form">
        <label>
          Name:
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <div className="signin-link">
        <span>
          Already have an account? <Link href="/login">Log In</Link>
        </span>
      </div>
    </div>
  );
};

export default SignUpPage;
