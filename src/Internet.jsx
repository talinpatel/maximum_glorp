import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./CssFiles/Internet.css";
import { Helmet } from "react-helmet";

export default function Internet({ onClose }) {
  const [url, setUrl] = useState("");
  const [currentView, setCurrentView] = useState("main");
  const [currentUrl, setCurrentUrl] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { type: "system", text: "WELCOME TO LOYALTY CHAT ROOM 7-B" },
    { type: "system", text: "ALL MESSAGES ARE MONITORED BY THE MINISTRY" },
    
    // Opening exchanges
    { user: "CITIZEN-4582", text: "Praise our leaders! I've reported 3 violations this morning alone!" }, // Evil
    { user: "CITIZEN-1124", text: "The new ration cards seem to be... malfunctioning more than usual" }, // Good (1)
    { user: "CITIZEN-7821", text: "CITIZEN-1124, file a proper report instead of complaining!" }, // Evil
    
    // Mid-conversation cluster
    { user: "CITIZEN-3094", text: "Production quotas increased by 15%! Glory to the Ministry!" }, // Evil
    { user: "CITIZEN-3368", text: "Has anyone else noticed the ventilation systems failing during night shift?" }, // Good (2)
    { user: "CITIZEN-6651", text: "All equipment functions at Ministry-approved levels" }, // Evil
    { user: "CITIZEN-0023", text: "Compliance brings warmth! Discontent brings frost!" }, // Evil
    
    // Second cluster
    { user: "CITIZEN-4495", text: "The educational films keep repeating the same 3 segments..." }, // Good (3)
    { user: "CITIZEN-7821", text: "Repetition ensures proper ideological absorption!" }, // Evil
    { user: "CITIZEN-9102", text: "Mandatory self-criticism session at 1900 hours!" }, // Evil
    
    // Later exchanges
    { user: "CITIZEN-5570", text: "My productivity monitor deducts points when I blink too often" }, // Good (4)
    { user: "CITIZEN-4582", text: "The Ministry's biometric standards are perfect!" }, // Evil
    { user: "CITIZEN-1124", text: "The cafeteria portions shrank again... for our own nutrition optimization?" }, // Good (1 reappears)
    { user: "CITIZEN-0023", text: "All allocations are scientifically determined!" }, // Evil
    
    // Final messages
    { user: "CITIZEN-3368", text: "The night shift lighting makes the warning posters hard to read..." }, // Good (2 reappears)
    { user: "CITIZEN-6651", text: "Report for vision testing immediately CITIZEN-3368" }, // Evil
    { user: "CITIZEN-4495", text: "The new history modules omit last year's harvest figures..." }, // Good (3 reappears)
    { user: "CITIZEN-5570", text: "My badge reader approved me as CITIZEN-5507 today... glitch?" } // Good (4 reappears)
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const nodeRef = React.useRef(null);

  const getRandomPosition = () => {
    const maxX = window.innerWidth - 500;
    const maxY = window.innerHeight - 600;
    return {
      x: Math.max(0, Math.floor(Math.random() * maxX)),
      y: Math.max(0, Math.floor(Math.random() * maxY))
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      const normalizedUrl = url.toLowerCase().trim();
      setCurrentUrl(url);
      
      if (normalizedUrl.includes("loyalty-chat")) {
        setCurrentView("chat");
      } else if (normalizedUrl.includes("traitor-tracker")) {
        setCurrentView("tracker");
      } else if (normalizedUrl.includes("rations")) {
        setCurrentView("rations");
      } else {
        setCurrentView("warning");
      }
      
      setUrl("");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        { user: "YOU", text: newMessage.trim() }
      ]);
      setNewMessage("");
    }
  };

  const renderMainView = () => (
    <div className="net-main-view">
      <form onSubmit={handleSubmit} className="net-url-form">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="ENTER APPROVED URL"
          className="net-url-input"
        />
        <button type="submit" className="net-go-btn">ACCESS</button>
      </form>

      <div className="net-services">
        <button 
          className="net-service-btn"
          onClick={() => {
            setCurrentUrl("gov.secure/loyalty-chat");
            setCurrentView("chat");
          }}
        >
          LOYALTY CHAT
        </button>
        <button 
          className="net-service-btn"
          onClick={() => {
            setCurrentUrl("gov.secure/traitor-tracker");
            setCurrentView("tracker");
          }}
        >
          TRAITOR TRACKER
        </button>
        <button 
          className="net-service-btn"
          onClick={() => {
            setCurrentUrl("gov.secure/rations");
            setCurrentView("rations");
          }}
        >
          RATIONS LIST
        </button>
      </div>
    </div>
  );

  const renderSiteView = () => (
    <div className="net-full-view">
      <div className="site-content">
        <h2>MINISTRY APPROVED CONTENT</h2>
        <p>This is the official page for: {currentUrl}</p>
        <p>All content has been reviewed and approved by the Ministry.</p>
      </div>
    </div>
  );

  const renderWarningView = () => (
    <div className="net-full-view">
      <div className="warning-content">
        <h2 className="warning-title">UNAPPROVED WEBSITE</h2>
        <div className="warning-message">
          <p>ACCESS TO {currentUrl.toUpperCase()} HAS BEEN DENIED</p>
          <p>THIS SITE IS NOT APPROVED BY THE MINISTRY</p>
          <p>ATTEMPTING TO ACCESS UNAPPROVED SITES IS PUNISHABLE BY LAW</p>
        </div>
        <div className="warning-footer">
          <p>YOUR ACTIVITY HAS BEEN LOGGED</p>
        </div>
      </div>
    </div>
  );

// In your Internet component
const renderChatView = () => (
  <div className="net-full-view">
    <div className="chat-messages-container">
      <div className="chat-messages-scroll">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`message ${msg.type || ""}`}>
            {msg.user && <span className="user">{msg.user}:</span>} {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
    <form onSubmit={handleSendMessage} className="chat-input-container">
      <input 
        type="text" 
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="TYPE MESSAGE (MONITORED)" 
        className="chat-input"
      />
      <button type="submit" className="chat-send-btn">SEND</button>
    </form>
  </div>
);

  const renderTrackerView = () => (
    <div className="net-full-view">
      <div className="tracker-header">
        <span>RANK</span>
        <span>CITIZEN ID</span>
        <span>COMPLIANCE</span>
        <span>STATUS</span>
      </div>
      <div className="tracker-list">
        <div className="tracker-entry warning">
          <span>1.</span>
          <span>CTZ-1XX4</span>
          <span>32%</span>
          <span className="status-warning">WATCHED</span>
        </div>
        <div className="tracker-entry warning">
          <span>2.</span>
          <span>CTZ-X36X</span>
          <span>12%</span>
          <span className="status-warning">WATCHED</span>
        </div>
        <div className="tracker-entry warning">
          <span>3.</span>
          <span>CTZ-44XX</span>
          <span>45%</span>
          <span className="status-warning">WATCHED</span>
        </div>
        <div className="tracker-entry warning">
          <span>4.</span>
          <span>CTZ-XX7X</span>
          <span>45%</span>
          <span className="status-warning">WATCHED</span>
        </div>
      </div>
    </div>
  );

  const renderRationsView = () => (
    <div className="net-full-view">
      <div className="rations-list">
        <div className="ration-item">
          <span className="ration-name">BASIC SUSTENANCE PACK</span>
          <span className="ration-status">AVAILABLE</span>
        </div>
        <div className="ration-item">
          <span className="ration-name">VITAMIN SUPPLEMENT</span>
          <span className="ration-status">AVAILABLE</span>
        </div>
        <div className="ration-item">
          <span className="ration-name">WORKER STIMULANT</span>
          <span className="ration-status">UNAVAILABLE</span>
        </div>
      </div>
    </div>
  );

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={getRandomPosition()}
      bounds="parent"
      handle=".net-header"
    >
      <div className="net-container" ref={nodeRef}>
        <Helmet>
          <title>Ministry-Approved Network</title>
        </Helmet>
        
        <div className="net-header">
          <button className="brutal-closeR" onClick={onClose}>X</button>
          <h1 className="net-title">GOVERNMENT NETWORK ACCESS</h1>
        </div>
        
        {/* URL Bar */}
        {currentView !== "main" && (
          <div className="net-url-bar">
            <button 
              className="net-back-btn"
              onClick={() => setCurrentView("main")}
            >
              ← BACK
            </button>
            <div className="current-url-display">
              {currentUrl}
            </div>
          </div>
        )}
        
        <div className="net-content">
          {currentView === "main" && renderMainView()}
          {currentView === "site" && renderSiteView()}
          {currentView === "warning" && renderWarningView()}
          {currentView === "chat" && renderChatView()}
          {currentView === "tracker" && renderTrackerView()}
          {currentView === "rations" && renderRationsView()}
        </div>
        
        <div className="net-footer">
          <span>STATUS: NETWORK MONITORED</span>
        </div>
      </div>
    </Draggable>
  );
}