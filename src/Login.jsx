import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./CssFiles/Login.css";

export default function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/Desktop", { state: { userName: name } });
  };

  return (
    <div className="login-container">

      <div className="login-box">
        <h1 className="login-title">LOGIN</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>NAME:</label>
            <input 
              type="text" 
              className="brutal-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="brutal-button">
            ENTER
          </button>
        </form>
      </div>
    </div>
  );
}