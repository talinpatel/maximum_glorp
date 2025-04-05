import React, { useState } from "react";
import Draggable from "react-draggable";
import "./CssFiles/Profile.css";
import { Helmet } from "react-helmet";
import profileImage from "./Assets/Eye.jpg";

export default function Profile({ onClose }) {
  const [userData] = useState({
    name: "JOHN DOE",
    location: "SECTOR 7",
    reports: 42,
    CI: 60 // Default to 20%
  });

  const nodeRef = React.useRef(null);

  const getRandomPosition = () => {
    const maxX = window.innerWidth - 340;
    const maxY = window.innerHeight - 500;
    return {
      x: Math.max(0, Math.floor(Math.random() * maxX)),
      y: Math.max(0, Math.floor(Math.random() * maxY))
    };
  };

  // Smooth color transition from red to green
  const getCIColor = (ci) => {
    const hue = ci * 1.2; // 0-120 (red to green)
    return `hsl(${hue}, 100%, 50%)`;
  };

  // Continuous status text with smooth transitions
  const getStatusText = (ci) => {
    if (ci < 10) return "DANGEROUSLY NON-COMPLIANT";
    if (ci < 20) return "SEVERELY NON-COMPLIANT";
    if (ci < 30) return "NON-COMPLIANT";
    if (ci < 40) return "MINIMALLY COMPLIANT";
    if (ci < 50) return "PARTIALLY COMPLIANT";
    if (ci < 60) return "MODERATELY COMPLIANT";
    if (ci < 70) return "COMPLIANT";
    if (ci < 80) return "HIGHLY COMPLIANT";
    if (ci < 90) return "EXEMPLARY COMPLIANCE";
    return "PERFECT COMPLIANCE";
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={getRandomPosition()}
      bounds="parent"
      handle=".profile-header"
    >
      <div className="profile-window" ref={nodeRef}>
        <div className="profile-header">
          <button className="profile-close-btn" onClick={onClose}>X</button>
          <h1 className="profile-title">CITIZEN PROFILE</h1>
        </div>
        
        <div className="profile-content-area">
          <div className="profile-image-container">
            <img 
              src={profileImage} 
              alt="Citizen Profile" 
              className="profile-avatar"
            />
            
            <div className="profile-data-section">
              <div className="profile-data-row">
                <span className="profile-data-label">NAME:</span>
                <span className="profile-data-value">{userData.name}</span>
              </div>
              
              <div className="profile-data-row">
                <span className="profile-data-label">LOCATION:</span>
                <span className="profile-data-value">{userData.location}</span>
              </div>
              
              <div className="profile-data-row">
                <span className="profile-data-label">REPORTS:</span>
                <span className="profile-data-value">{userData.reports}</span>
              </div>

              <div className="profile-ci-container">
                <div className="profile-data-label">COMPLIANCE INDEX:</div>
                <div className="ci-bar-container">
                  <div 
                    className="ci-bar"
                    style={{
                      width: `${userData.CI}%`,
                      backgroundColor: getCIColor(userData.CI)
                    }}
                  >
                    <span className="ci-value">{userData.CI}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-footer" style={{ color: getCIColor(userData.CI) }}>
          <span>{getStatusText(userData.CI)}</span>
        </div>
      </div>
    </Draggable>
  );
}