
import React from "react";
import Link from "next/link";
import "./../../styles/home.css"; 

export default function HomePage() {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>AUTOMATIC <span className="highlight">SUBTITLE</span> GENERATION</h1>
        <p>Automatically generate subtitles for YouTube videos using sign language</p>
        <Link href="/upload">
          <button className="cta-button">Convert Video to Text</button>
        </Link>
      </section>                                                                                                                                                                                                                                                                                                              

      <section className="how-it-works">
        <h2>How to add subtitles to a video:</h2>
        <div className="steps">
          <div className="step">
            <h3>STEP 1</h3>
            <img src="/images/Home (1).png" alt="Service Demonstration" style={{ borderRadius: "70px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} />
            <p>Select "Convert Video to Text" and start transcribing.</p>
          </div>
          <div className="step">
            <h3>STEP 2</h3>
            <img src="/images/Home (2).png" alt="Service Demonstration" style={{ borderRadius: "70px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} />
            <p>Upload MP4 file and wait for the subtitles to generate.</p>
          </div>
          <div className="step">
            <h3>STEP 3</h3>
            <img src="/images/hình ảnh_2024-09-28_131234874.png" alt="Service Demonstration"  style={{ borderRadius: "70px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }} />
            <p>Wait for the website to complete the translation process.</p>
          </div>
        </div>
      </section>

      <section className="service-info">
        <h2>Our service</h2>
        <p>We provide a tool for translating sign language into automatic subtitles, helping content creators add subtitles 
          to their YouTube videos more easily and quickly.</p>
        <img src="/images/images (2).jpeg" alt="Service Demonstration" />
      </section>
    </div>
  );
}
