import React, { useState } from "react";
import Draggable from "react-draggable";
import "./CssFiles/News.css";
import { Helmet } from "react-helmet";

export default function News({ onClose }) {
  const [articles] = useState([
    {
      id: 1,
      title: "CITIZEN PRODUCTIVITY AT ALL-TIME HIGH",
      content: "Worker efficiency has increased 47% this quarter thanks to new productivity measures. All citizens are encouraged to maintain this progress.",
      date: "2080-11-15",
      approved: true
    },
    {
      id: 2,
      title: "UNREST IN █████████ SECTOR",
      content: "Reports of █████████ activity in █████████ have been █████████ by authorities. Remain █████████ and report any █████████ behavior.",
      date: "2080-11-14",
      approved: false
    },
    {
      id: 3,
      title: "NEW RECREATION HOURS ANNOUNCED",
      content: "Mandatory leisure time extended by 15 minutes daily. Praise our benevolent leaders for their generosity.",
      date: "2080-11-13",
      approved: true
    },
    {
      id: 4,
      title: "███ ████████ LEAK INVESTIGATION",
      content: "The Ministry of Truth is investigating █████████ involving █████████ documents. Those with information must █████████ immediately.",
      date: "2080-11-12",
      approved: false
    },
    {
      id: 5,
      title: "NUTRITIONAL SUPPLEMENT MANDATE",
      content: "New health supplements will be distributed during next ration cycle. Consumption is mandatory for all citizens.",
      date: "2080-11-11",
      approved: true
    }
  ]);

  const nodeRef = React.useRef(null);

  const getRandomPosition = () => {
    const maxX = window.innerWidth - 500;
    const maxY = window.innerHeight - 600;
    return {
      x: Math.max(0, Math.floor(Math.random() * maxX)),
      y: Math.max(0, Math.floor(Math.random() * maxY))
    };
  };

  const renderCensoredText = (text) => {
    return text.split(' ').map((word, i) => (
      word === '█████████' ? 
      <span key={i} className="redacted">{word}</span> : 
      word + ' '
    ));
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={getRandomPosition()}
      bounds="parent"
      handle=".news-header"
    >
      <div className="news-container" ref={nodeRef}>
        
        <div className="news-header">
          <button className="news-close-btn" onClick={onClose}>X</button>
          <h1 className="news-title">MINISTRY OF INFORMATION</h1>
        </div>
        
        <div className="news-content">
          <div className="news-banner">
            <div className="news-ticker">
              <span>WARNING: UNAUTHORIZED VIEWING OF CENSORED MATERIAL IS PUNISHABLE BY LAW •</span>
            </div>
          </div>
          
          <div className="articles-list">
            {articles.map(article => (
              <div key={article.id} className={`article-card ${article.approved ? '' : 'censored'}`}>
                <div className="article-header">
                  <span className="article-date">{article.date}</span>
                  <span className={`article-status ${article.approved ? 'approved' : 'classified'}`}>
                    {article.approved ? 'APPROVED CONTENT' : 'CLASSIFIED MATERIAL'}
                  </span>
                </div>
                <h2 className="article-title">
                  {article.approved ? article.title : renderCensoredText(article.title)}
                </h2>
                <p className="article-content">
                  {article.approved ? article.content : renderCensoredText(article.content)}
                </p>
                <div className="article-footer">
                  <span className="article-source">Source: Ministry of Truth</span>
                  <span className="article-id">Ref: {article.id}/2080/MOT</span>
                </div>
                {!article.approved && (
                  <div className="censorship-warning">
                    <span>CONTENT REDACTED BY ORDER OF MINISTRY OF SECURITY</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="news-footer">
          <span>STATUS: {articles.some(a => !a.approved) ? "CENSORSHIP PROTOCOLS ACTIVE" : "DISSEMINATING OFFICIAL COMMUNIQUÉS"}</span>
        </div>
      </div>
    </Draggable>
  );
}