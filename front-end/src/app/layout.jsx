'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import './globals.css';
import './../styles/layout.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [showHeaderFooter, setShowHeaderFooter] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  useEffect(() => {
    const pagesWithoutHeaderFooter = ["/login", "/signup"];
    setShowHeaderFooter(!pagesWithoutHeaderFooter.includes(pathname));
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Poppins, sans-serif' }}>
        {showHeaderFooter && (
          <header className="sticky-header">
            <div className="logo">Web Name</div>

            

           
            <nav className={`navbar ${isMenuOpen ? 'open' : ''}`}>
              <Link href="/">Home</Link>
              <Link href="/aboutus">About Us</Link>
              <Link href="/contact">Contact</Link>
            </nav>

            <div className="auth-buttons">
              <Link href="/login" className="login">Log In</Link>
              <Link href="/signup" className="signup">Sign Up</Link>
            </div>
          </header>
        )}

        <main className={showHeaderFooter ? "main-content" : ""}>{children}</main>

        {showHeaderFooter && (
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-menu">
                <h4>Menu</h4>
                <a href="/homepage">Home</a>
                <a href="/aboutus">About Us</a>
                <a href="/contact">Contact</a>
              </div>
              <div className="footer-contact">
                <h4>Contact Us</h4>
                <p>Email: test@example.com</p>
                <p>Phone: 1900.xxxx</p>
              </div>
            </div>
            <div className="footer-bottom">
              <p>Copyright © 2024 | All Rights Reserved</p>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}
