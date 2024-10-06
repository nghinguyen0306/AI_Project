'use client';

import React, { useState } from 'react';
import './../../styles/upload.css';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [isTranslated, setIsTranslated] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) clearInterval(interval);
        }, 200);
    };

    const handleTranslate = () => {
        
        setIsTranslated(true);
    };

    const handleReset = () => {
       
        setFile(null);
        setIsTranslated(false);
        setUploadProgress(0);
    };

    return (
        <div className="upload-page-container">
            <div className="upload-section">
                <h2 className="upload-header">Upload Your MP4 File</h2>
                <div className="file-upload-center">
                   
                    {file ? (
                        <p className="file-name">{file.name}</p>
                    ) : (
                        <label className="file-upload-container">
                            <input type="file" accept="video/mp4" onChange={handleFileChange} className="file-input" />
                            <span className="upload-button">Choose MP4 File</span>
                        </label>
                    )}
                </div>

                
                {file && !isTranslated && (
                    <>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        {uploadProgress === 100 && (
                            <button className="start-translation-btn" onClick={handleTranslate}>Translate</button>
                        )}
                    </>
                )}

                
                {isTranslated && (
                    <button className="start-translation-btn" onClick={handleReset}>Select New File</button>
                )}
            </div>

            <div className="result-section">
                <h2 className="result-header">Translation Result</h2>
                {isTranslated 
                    ? <p className="translated-file">Your translation result goes here...</p>
                    : <p className="translated-file"></p>
                }
            </div>
        </div>
    );
};

export default UploadPage;
