import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import "./CssFiles/Report.css";
import { Helmet } from "react-helmet";

export default function Report({ onClose, complianceIndex, setComplianceIndex, traitorTracker, setTraitorTracker }) {
  const [name, setReportName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [specialNumbers, setSpecialNumbers] = useState(() => {
    // Retrieve the special numbers from localStorage or use the default if not present
    const storedSpecialNumbers = localStorage.getItem("specialNumbers");
    return storedSpecialNumbers ? JSON.parse(storedSpecialNumbers) : ["1124", "3368", "4495", "5570"];
  });

  const nodeRef = React.useRef(null);

  const getRandomPosition = () => {
    const maxX = window.innerWidth - 340;
    const maxY = window.innerHeight - 500;
    return {
      x: Math.max(0, Math.floor(Math.random() * maxX)),
      y: Math.max(0, Math.floor(Math.random() * maxY)),
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the citizen is in the special numbers list
    const isSpecialCitizen = specialNumbers.some((num) => name.includes(num));

    // Check if the selected date is in the year 2080
    const isDateCorrect = date.startsWith("2080-");

    let adjustment = 0;

    if (isSpecialCitizen) {
      adjustment = isDateCorrect ? 5 : 2;
    } else {
      adjustment = -5;
    }

    // Adjust compliance index
    const newComplianceIndex = Math.max(0, Math.min(100, complianceIndex + adjustment));
    setComplianceIndex(newComplianceIndex);

    // Store the updated compliance index in localStorage
    localStorage.setItem("complianceIndex", newComplianceIndex);

    // If the citizen is special, remove them from both special numbers and traitor tracker
    if (isSpecialCitizen) {
      const newSpecialNumbers = specialNumbers.filter((num) => !name.includes(num)); // Remove from special numbers
      setSpecialNumbers(newSpecialNumbers); // Update the state with the new special numbers list

      // Store the updated special numbers in localStorage
      localStorage.setItem("specialNumbers", JSON.stringify(newSpecialNumbers));

      const newTraitorTracker = traitorTracker.filter((citizen) => citizen !== name);
      setTraitorTracker(newTraitorTracker); // Update traitor tracker
    }

    // Clear the input fields after submission
    setReportName(""); // Clear the name
    setDate(""); // Clear the date
    setDescription(""); // Clear the description

    alert("REPORT SUBMITTED. THANK YOU FOR YOUR LOYALTY, CITIZEN.");
  };

  // Retrieve the compliance index from localStorage on component mount
  useEffect(() => {
    const storedComplianceIndex = localStorage.getItem("complianceIndex");
    if (storedComplianceIndex) {
      setComplianceIndex(parseInt(storedComplianceIndex, 10));
    }
  }, [setComplianceIndex]);

  useEffect(() => {
    console.log("Current Compliance Index:", complianceIndex);
  }, [complianceIndex]);

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={getRandomPosition()}
      bounds="parent"
      handle=".brutal-headerR"
    >
      <div className="brutal-boxR" ref={nodeRef}>
        <Helmet>
          <title>Citizen Report</title>
        </Helmet>

        <div className="brutal-headerR">
          <button className="brutal-closeR" onClick={onClose}>
            X
          </button>
          <h1 className="brutal-titleR">CITIZEN REPORT</h1>
        </div>

        <div className="brutal-contentR">
          <form onSubmit={handleSubmit}>
            <div className="brutal-input-groupR">
              <label>REPORT USER:</label>
              <input
                type="text"
                className="brutal-inputR"
                value={name}
                onChange={(e) => setReportName(e.target.value)}
                required
              />

              <label>DATE:</label>
              <input
                type="date"
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
