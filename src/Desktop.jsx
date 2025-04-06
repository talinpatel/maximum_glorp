import React, { useState, useRef, useEffect } from "react";
import { redirect, Route, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Citizen Index (CI) State - Retrieve from localStorage if available
  const [complianceIndex, setComplianceIndex] = useState(() => {
    const savedCI = localStorage.getItem('complianceIndex');
    return savedCI ? parseInt(savedCI, 10) : 60; // Default CI if not found
  });

  // Loyalty Questionnaire State
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const questionnaireRef = useRef(null);

  const questions = [
    {
      prompt: "HOW DO YOU FEEL ABOUT OUR LEADERSHIP?",
      options: ['GOOD', 'GREAT', 'FANTASTIC'],
    },
    {
      prompt: "HOW LOYAL ARE YOU TO OUR GLORIOUS NATION?",
      options: ['VERY LOYAL', 'EXTREMELY LOYAL', 'LOYAL WITHOUT QUESTION'],
    },
    {
      prompt: "DO YOU TRUST THE INFORMATION PROVIDED BY OFFICIAL SOURCES?",
      options: ['ABSOLUTELY', 'WITHOUT DOUBT', 'COMPLETELY'],
    },
    {
      prompt: "WILL YOU REPORT ANY SUSPICIOUS ACTIVITY?",
      options: ['IMMEDIATELY', 'WITHOUT HESITATION', 'AT ONCE'],
    },
    {
      prompt: "HOW DO YOU VIEW DISSENTERS?",
      options: ['WITH DISTRUST', 'WITH CONTEMPT', 'AS ENEMIES'],
    },
  ];

  // Spacebar toggles assistant
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

  // Save complianceIndex to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('complianceIndex', complianceIndex);
  }, [complianceIndex]);

  useEffect(() => {
    if (!showQuestionnaire) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleLoyaltySubmit('noncompliant');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showQuestionnaire]);

  useEffect(() => {
    const startInterval = () => {
      const randomInterval = Math.floor(Math.random() * 120000) + 180000; // 3-5 min
      return setTimeout(() => {
        showRandomQuestionnaire();
        startInterval();
      }, randomInterval);
    };

    const initialDelay = Math.floor(Math.random() * 120000) + 180000;
    const timer = setTimeout(() => {
      showRandomQuestionnaire();
      startInterval();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, []);

  const showRandomQuestionnaire = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    setCurrentQuestion(randomQuestion);
    setShowQuestionnaire(true);
    setTimeLeft(30);
  };

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
    navigate('/tts')
    
  };

  const closeApp = (appName) => {
    setActiveApps(activeApps.filter(app => app !== appName));
  };

  const clampCI = (value) => Math.max(0, Math.min(100, value));

  const handleLoyaltySubmit = (response) => {
    setShowQuestionnaire(false);

    // Handle CI adjustment
    if (response === 'noncompliant') {
      setComplianceIndex(prev => clampCI(prev - 5));
      console.log("Citizen failed to comply with loyalty assessment!");
    } else {
      const options = currentQuestion.options;
      const isLastOption = response === options[options.length - 1].toLowerCase();

      if (isLastOption) {
        setComplianceIndex(prev => clampCI(prev + 5));
      } else {
        setComplianceIndex(prev => clampCI(prev - 5));
      }
    }
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
        {activeApps.includes("PROFILE") && <Profile onClose={() => closeApp("PROFILE")} complianceIndex={complianceIndex} />}
        {activeApps.includes("REPORT") && <Report onClose={() => closeApp("REPORT")} complianceIndex={complianceIndex} setComplianceIndex={setComplianceIndex} />}
        {activeApps.includes("NET") && <Internet onClose={() => closeApp("NET")} />}
        {assistantActive && <Assistant />}

        {showQuestionnaire && currentQuestion && (
          <Draggable
            bounds="parent"
            handle=".brutal-questionnaire-header"
            nodeRef={questionnaireRef}
          >
            <div className="brutal-questionnaire" ref={questionnaireRef}>
              <div className="brutal-questionnaire-header">
                <div className="brutal-questionnaire-timer">TIME: {timeLeft}s</div>
                <h2 className="brutal-questionnaire-title">MANDATORY LOYALTY ASSESSMENT</h2>
              </div>

              <div className="brutal-questionnaire-content">
                <p className="brutal-questionnaire-prompt">{currentQuestion.prompt}</p>

                <div className="brutal-questionnaire-options">
                  {currentQuestion.options.map(option => (
                    <button
                      key={option}
                      className="brutal-questionnaire-option"
                      onClick={() => handleLoyaltySubmit(option.toLowerCase())}
                    >
                      [ {option} ]
                    </button>
                  ))}
                </div>
              </div>

              <div className="brutal-questionnaire-footer">
                COMPULSORY RESPONSE | NON-COMPLIANCE WILL BE PUNISHED
              </div>
            </div>
          </Draggable>
        )}
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
