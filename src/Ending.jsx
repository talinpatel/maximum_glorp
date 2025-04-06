import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CssFiles/Ending.css";

export default function Ending() {
  const location = useLocation();
  const [showText, setShowText] = useState(false);
  const [randomCitizenNumber, setRandomCitizenNumber] = useState("");
  const [isBadEnding, setIsBadEnding] = useState(false);

  useEffect(() => {
    // Check if this is a bad ending from location state
    if (location.state?.endingType === "bad") {
      setIsBadEnding(true);
      
      // Generate a random citizen number between 1000 and 9999
      const randomNum = Math.floor(Math.random() * 9000) + 1000;
      setRandomCitizenNumber(randomNum.toString());
      
      // Delay showing the text for a fade-in effect
      const timer = setTimeout(() => {
        setShowText(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (!isBadEnding) {
    return <>hello</>;
  }

  return (
    <div className="bad-ending-container">
      {showText && (
        <div className="bad-ending-text">
          You were reported by Citizen {randomCitizenNumber} and was promptly imprisoned indefinitely.
        </div>
      )}
    </div>
  );
}