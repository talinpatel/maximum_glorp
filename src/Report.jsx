import React, { useState } from "react";
import Draggable from "react-draggable";
import "./CssFiles/Report.css";
import { Helmet } from "react-helmet";

export default function Report({ onClose }) {
  const [name, setReportName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const nodeRef = React.useRef(null);

  const getRandomPosition = () => {
    const maxX = window.innerWidth - 340;
    const maxY = window.innerHeight - 500;
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
      defaultPosition={getRandomPosition()}
      bounds="parent"
      handle=".brutal-headerR"
    >
      <div className="brutal-boxR" ref={nodeRef}>
        <div className="brutal-headerR">
          <button className="brutal-closeR" onClick={onClose}>X</button>
          <h1 className="brutal-titleR">CITIZEN REPORT</h1>
        </div>
        
        <div className="brutal-contentR">
          <form onSubmit={handleSubmit}>
          <div className="brutal-input-groupR">
              <label>REPORT NAME:</label>
              <input 
                type="text" 
                className="brutal-inputR"
                value={name}
                onChange={(e) => setReportName(e.target.value)}
                required
              />
              
              <label>DATE:</label>
              <input 
                type="text" 
                className="brutal-inputR"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              
              <label>DESCRIPTION:</label>
              <textarea 
                className="brutal-inputR brutal-textareaR"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="brutal-commandsR">
              <button type="submit" className="brutal-buttonR">
                SUBMIT REPORT
              </button>
            </div>
          </form>
        </div>
        
        <div className="brutal-footerR">
          <span>STATUS: AWAITING INPUT</span>
        </div>
      </div>
    </Draggable>
  );
}