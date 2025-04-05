import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Draggable from "react-draggable";
import "./CssFiles/Desktop.css";
import Profile from './Profile';
import News from './News';
import Report from './Report';
import Internet from './Internet';
import Assistant from './Assistant';

export default function BrutalistDesktop() {
  const location = useLocation();
  const { userName } = location.state || {};
  const [activeApps, setActiveApps] = useState([]);
  const nodeRefs = useRef({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [assistantActive, setAssistantActive] = useState(true);

  // Spacebar handler that ignores text inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeElement = document.activeElement;
      const isTextInput = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'TEXTAREA' ||
                         activeElement.isContentEditable;
      
      if (e.code === 'Space' && !isTextInput) {
        e.preventDefault();
        setAssistantActive(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [Apps] = useState([
    { id: 0, name: "NEWS", icon: '📰' },
    { id: 1, name: "PROFILE", icon: '👤' },
    { id: 2, name: "REPORT", icon: '⚠️' },
    { id: 3, name: "NET", icon: '🌐' },
  ]);

  const [positions, setPositions] = useState(() => {
    const initialPositions = {};
    Apps.forEach((app, index) => {
      initialPositions[app.name] = { 
        x: 20 + (index % 4) * 120, 
        y: 20 + Math.floor(index / 4) * 120 
      };
    });
    return initialPositions;
  });

  const getFutureDate = () => {
    const now = new Date();
    return new Date(
      2080,
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );
  };

  useEffect(() => {
    const timerID = setInterval(() => setCurrentTime(getFutureDate()), 1000);
    return () => clearInterval(timerID);
  }, []);

  useEffect(() => {
    const savedPositions = localStorage.getItem('brutalistPositions');
    if (savedPositions) setPositions(JSON.parse(savedPositions));
  }, []);

  useEffect(() => {
    localStorage.setItem('brutalistPositions', JSON.stringify(positions));
  }, [positions]);

  const openApp = (appName) => {
    if (!activeApps.includes(appName)) {
      setActiveApps([...activeApps, appName]);
    }
  };

  const handleStop = (e, data, appName) => {
    setPositions(prev => ({
      ...prev,
      [appName]: { x: data.x, y: data.y }
    }));
  };

  const handleDoubleClick = (appName) => {
    openApp(appName);
  };

  const toggleAssistant = () => {
    setAssistantActive(!assistantActive);
  };

  const closeApp = (appName) => {
    setActiveApps(activeApps.filter(app => app !== appName));
  };

  return (
    <div className="brutal-desktop">
      <Helmet>
        <title>Desktop</title>
      </Helmet>

      <div className="desktop-area">
        {Apps.map(app => (
          <Draggable
            key={app.id}
            nodeRef={nodeRefs.current[app.id] || (nodeRefs.current[app.id] = React.createRef())}
            defaultPosition={positions[app.name]}
            position={null}
            onStop={(e, data) => handleStop(e, data, app.name)}
            bounds="parent"
          >
            <div 
              ref={nodeRefs.current[app.id]}
              className="brutal-icon"
              onDoubleClick={() => handleDoubleClick(app.name)}
            >
              <div className="icon-frame">[{app.icon}]</div>
              <div className="brutal-label">{app.name}</div>
            </div>
          </Draggable>
        ))}

        {activeApps.includes("NEWS") && <News onClose={() => closeApp("NEWS")} />}
        {activeApps.includes("PROFILE") && <Profile onClose={() => closeApp("PROFILE")} />}
        {activeApps.includes("REPORT") && <Report onClose={() => closeApp("REPORT")} />}
        {activeApps.includes("NET") && <Internet onClose={() => closeApp("NET")} />}
        {assistantActive && <Assistant />}
      </div>

      <div className="brutal-taskbar">
        {userName ? (
          <div className="brutal-buttonD">Welcome, {userName}!</div>
        ) : (
          <div className="brutal-buttonD">Welcome [No user name provided]!</div>
        )}
        
        <button 
          className={`assistant-button ${assistantActive ? 'active' : ''}`}
          onClick={toggleAssistant}
          style={{ marginLeft: 'auto', marginRight: '10px' }}
        >
          {assistantActive ? "DEACTIVATE ASSISTANT" : "ACTIVATE ASSISTANT"}
        </button>
        
        <div className="brutal-clock">
          [{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}]
        </div>
      </div>
    </div>
  );
}