'use client'; 
import React, { useState } from "react";
import Layout from "./layout";
import "./../../styles/contact.css";

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Cập nhật trạng thái sau khi submit
  };

  return (
    <Layout>
    
      <div className="contact-page">
        {isSubmitted ? (
          <div className="thank-you-message">
            <h1>Thank you for reaching out!</h1>
            <p>We will respond to you shortly.</p>
          </div>
        ) : (
          <>
            <h1>Contact us</h1>
            <p>Any question or remarks? Just write us a message!</p>
            <form className="contact-form" onSubmit={handleSubmit}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" required />

              <label htmlFor="name">Name</label>
              <input type="text" id="name" placeholder="Enter your name" required />

              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="Message" rows="4" required></textarea>

              <button type="submit" className="submit-button">Submit</button>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ContactPage;
