import React, { useState } from "react";
import Draggable from "react-draggable";
import "./CssFiles/Report.css";
import { Helmet } from "react-helmet";

export default function Report({ onClose }) {
  const [name, setReportName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const nodeRef = React.useRef(null);

  // Calculate random position within screen bounds immediately
  const getRandomPosition = () => {
    const maxX = window.innerWidth - 340; // component width
    const maxY = window.innerHeight - 750; // component height
    return {
      x: Math.max(0, Math.floor(Math.random() * maxX)),
      y: Math.max(0, Math.floor(Math.random() * maxY))
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReportName("");
    setDate("");
    setDescription("");
    alert("REPORT SUBMITTED. THANK YOU FOR YOUR LOYALTY, CITIZEN.");
  };
  
  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={getRandomPosition()} // Calculate position here
      bounds="parent"
      handle=".brutal-header"
    >
      <div className="brutal-box" ref={nodeRef}>
        <div className="brutal-header">
          <button className="brutal-close" onClick={onClose}>X</button>
          <h1 className="brutal-title">CITIZEN REPORT</h1>
        </div>
        
        <div className="brutal-content">
          <form onSubmit={handleSubmit}>
            <div className="brutal-input-group">
              <label>REPORT NAME:</label>
              <input 
                type="text" 
                className="brutal-input"
                value={name}
                onChange={(e) => setReportName(e.target.value)}
                required
              />
              
              <label>DATE:</label>
              <input 
                type="text" 
                className="brutal-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              
              <label>DESCRIPTION:</label>
              <textarea 
                className="brutal-input brutal-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="brutal-commands">
              <button type="submit" className="brutal-button">
                SUBMIT REPORT
              </button>
            </div>
          </form>
        </div>
        
        <div className="brutal-footer">
          <span>STATUS: AWAITING INPUT</span>
        </div>
      </div>
    </Draggable>
  );
}