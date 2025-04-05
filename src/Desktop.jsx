import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet";
import "./CssFiles/Desktop.css";

import Profile from './Profile'
import News from './News'
import Report from './Report'
import Internet from './Internet'

export default function Desktop() {
  const location = useLocation();
  const { userName } = location.state || {};
  const [activeApps, setActiveApps] = useState([]);
  const navigate = useNavigate();
  const [Apps, setApps] = useState([
      { id: 0, name: "News", icon: '📰', route: "/Desktop" }, // Add Messages to the games list
      { id: 1, name: "Profile", icon: '👤', route: "/Desktop" },
      { id: 2, name: "Report", icon: '📢', route: "/Desktop" },
      { id: 3, name: "Internet", icon: '🌐', route: "/Desktop" },
  ]);

  return (
    <div className="desktop">
      <Helmet>
          <title>Desktop</title>
      </Helmet>
    </div>
  );
}