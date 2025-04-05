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
    CI: 100
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

              <div className="profile-data-row">
                <span className="profile-data-label">COMPLIANCE INDEX:</span>
                <span className="profile-data-value">{userData.CI}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="profile-footer">
          <span>STATUS: VERIFIED CITIZEN</span>
        </div>
      </div>
    </Draggable>
  );
}