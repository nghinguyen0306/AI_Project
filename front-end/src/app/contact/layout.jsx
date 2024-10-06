import React from "react";
import Link from 'next/link';
import "./../../styles/contact.css";

const ContactLayout = ({ children }) => {
    return (
      <>
        <main>
          {children}
        </main>
      </>
    );
  };
  
  export default ContactLayout;