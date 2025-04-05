import React, { useState } from "react";
import "./CssFiles/Report.css";
import { Helmet } from "react-helmet";

export default function Report() {
  const [name, setReportName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setReportName("");
    setDate("");
    setDescription("");

    alert("Thank you for your loyalty, citizen.");
  };
  
  return (
    <div className="login-container">
      <Helmet>
        <title>Report</title>
      </Helmet>
      
      <div className="report-box">
        <h1 className="report-title">Citizen Report</h1>
        <div className='report-information-container'>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>REPORT NAME:</label>
              <input 
                type="text" 
                className="brutal-input"
                style={{ width: "500px", height: "40px", padding: "5px", boxSizing: "border-box"}}
                value={name}
                onChange={(e) => setReportName(e.target.value)}
                required
              />
              <label>DATE:</label>
              <input 
                type="text" 
                className="brutal-input"
                style={{ width: "500px", height: "40px", padding: "5px", boxSizing: "border-box"}}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <label>DESCRIPTION:</label>
              <textarea 
                type="text" 
                className="brutal-input"
                style={{ width: "500px", height: "120px", padding: "5px", boxSizing: "border-box"}}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="brutal-button">
            SUBMIT
          </button>
          </form>
        </div>
      </div>
    </div>
  );
}