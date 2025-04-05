import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import "./CssFiles/Assistant.css";
import face1 from "./Assets/face1.png";
import face2 from "./Assets/face2.png";
import face3 from "./Assets/face3.png";
import face4 from "./Assets/face4.png";

const faceImages = [face1, face2, face3, face4];
const messages = [
  "SYSTEM INITIALIZED. AWAITING USER INPUT.",
  "HELLO USER. HOW CAN I ASSIST YOU TODAY?",
  "ALL SYSTEMS OPERATIONAL. READY FOR COMMANDS.",
  "WARNING: SOME SYSTEMS MAY BE BRUTAL.",
  "THIS INTERFACE IS OPTIMIZED FOR EFFICIENCY.",
  "SPEAK NOW OR PRESS BUTTON FOR OPTIONS."
];

export default function Assistant({ onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentFace, setCurrentFace] = useState(face1);
  const [currentMessage, setCurrentMessage] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = React.useRef(null);
  const speechSynthRef = useRef(null);
  const wordTimerRef = useRef(null);
  const wordsRef = useRef([]);
  const currentWordIndexRef = useRef(0);

  const getRandomFace = () => {
    return faceImages[Math.floor(Math.random() * faceImages.length)];
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();
    clearTimeout(wordTimerRef.current);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    
    setIsSpeaking(true);
    setCurrentMessage(text);
    wordsRef.current = text.split(/\s+/);
    currentWordIndexRef.current = 0;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        currentWordIndexRef.current++;
        setCurrentFace(getRandomFace());
      }
    };
    
    utterance.onstart = () => {
      setCurrentFace(getRandomFace());
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      clearTimeout(wordTimerRef.current);
      setCurrentFace(face1); // Reset to default face when done
    };
    
    window.speechSynthesis.speak(utterance);
    speechSynthRef.current = utterance;
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      clearTimeout(wordTimerRef.current);
    } else {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      speak(randomMessage);
    }
  };

  const handleDragStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  useEffect(() => {
    // Initial greeting
    const timer = setTimeout(() => {
      speak(messages[0]);
    }, 1000);

    return () => {
      window.speechSynthesis.cancel();
      clearTimeout(wordTimerRef.current);
      clearTimeout(timer);
    };
  }, []);

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: window.innerWidth / 3, y: 50 }}
      position={null}
      onStop={handleDragStop}
      bounds="parent"
      handle=".brutal-header"
    >
      <div className="brutal-box" ref={nodeRef}>
        <div className="brutal-header">
          <h3 className="brutal-title">ASSISTANT.EXE</h3>
        </div>
        <div className="brutal-content">
          <div className="brutal-robot-box">
            <img 
              src={currentFace} 
              alt="Assistant Face" 
              className={`brutal-robot ${isSpeaking ? 'speaking' : ''}`}
            />
            <div className="brutal-status">
              {isSpeaking ? (
                <>
                  {wordsRef.current.slice(0, currentWordIndexRef.current).join(' ')}
                  <span className="blinking-cursor">|</span>
                  {wordsRef.current.slice(currentWordIndexRef.current).join(' ')}
                </>
              ) : "AWAITING INPUT"}
            </div>
          </div>
          
          <div className="brutal-commands">
            <button 
              className="brutal-button"
              onClick={toggleSpeaking}
            >
              {isSpeaking ? "STOP SPEAKING" : "SPEAK"}
            </button>
          </div>
        </div>
        <div className="brutal-footer">
          <span>STATUS: {isSpeaking ? "SPEAKING" : "IDLE"}</span>
        </div>
      </div>
    </Draggable>
  );
}