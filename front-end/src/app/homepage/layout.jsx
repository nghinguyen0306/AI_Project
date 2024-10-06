import React from "react";
import Link from 'next/link';
import "./../../styles/home.css";




const HomepageLayout = ({ children }) => {
    return (
      <>

        <main>
          {children}
        </main>
  
      </>
    );
  };
  
  export default HomepageLayout;