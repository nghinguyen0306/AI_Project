import React from "react";
import Link from "next/link";
import "./../../styles/aboutus.css";


export default function AboutPage() {
  return (
    

        <main className="about-container">
          <h1>About</h1>
          <h2>Web name</h2>


          <section className="about-section vision">
            <div className="text-box">
              <h3>Our Vision</h3>
              <p>
                Our vision is to provide a platform that empowers deaf individuals to communicate more effectively with their communities globally. By using modern subtitles and American Sign Language (ASL), we aim to create content seamlessly and help deaf content creators engage with their audience.
              </p>
            </div>
            <div className="image-box">
              <img
                src="/images/D_NQ_NP_2X_658862-MPE71312099018_082023-F.webp"
                alt="Our Vision"
              />
            </div>
          </section>

    
          <section className="about-section mission">
            <div className="image-box">
              <img
                src="/images/Signing-Image.webp"
                alt="Our Mission"
              />
            </div>
            <div className="text-box">
              <h3>Our Mission</h3>
              <p>
                Our mission is to empower deaf content creators by simplifying the subtitle creation process using advanced technology. Our platform enables more engagement with audiences, ensures content accessibility, and promotes inclusivity.
              </p>
            </div>
          </section>

          
          <section className="about-section story">
            <div className="text-box">
              <h3>Our Story</h3>
              <p>
                Social media empowers creators, but deaf individuals face challenges with accessible content. Our platform bridges the gap for deaf creators, automatically providing accurate and real-time subtitles, making the process faster and more efficient, and helping to support faster and more inclusive digital spaces.
              </p>
            </div>
            <div className="image-box">
              <img
                src="/images/image-19.png"
                alt="Our Story"
              />
            </div>
          </section>
        </main>
     
  );
}
