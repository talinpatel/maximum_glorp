import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CssFiles/Ending.css";

export default function Ending() {
  const location = useLocation();
  const [showText, setShowText] = useState(false);
  const [randomCitizenNumber, setRandomCitizenNumber] = useState("");
  const [isBadEnding, setIsBadEnding] = useState(false);
  const [isGoodEnding, setIsGoodEnding] = useState(false);

  useEffect(() => {
    // Check if this is a bad or good ending from location state
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
    } else if (location.state?.endingType === "good") {
      setIsGoodEnding(true);
      
      // Delay showing the good ending text for fade-in effect
      const timer = setTimeout(() => {
        setShowText(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  if (isBadEnding) {
    return (
      <div className="bad-ending-container">
        {showText && (
          <div className="bad-ending-text">
            You were reported by Citizen {randomCitizenNumber} and were promptly imprisoned indefinitely.
          </div>
        )}
      </div>
    );
  }

  if (isGoodEnding) {
    return (
      <div className="good-ending-container">
        {showText && (
          <div className="good-ending-text">
            You decided it was time to look beyond the controlling and oppressive regime of your government, and see the truth for what it really was. As the resistance grew, more faces joined the battle, hopeful for a future of change and the downfall of life as it had been. The regime could not deal with the organised, fearless and unified attacks of the resistance, with more and more vulnerabilities gradually showing until the fight broke out of the online world. You made the decision to resist. You weren’t just part of the change. You were its beginning.
          </div>
        )}
      </div>
    );
  }

  return <>hello</>;
}
