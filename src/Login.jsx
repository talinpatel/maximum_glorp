import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./CssFiles/Login.css";

export default function Login() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      console.log("handleSubmit")
      const response = await fetch("/",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({name: name})
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Only navigate after successful response
        navigate("/Desktop", { state: { userName: name } });
      } else {
        console.error("Failed to login:", data);
      }

    } catch(error){
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <Helmet>
          <title>Login</title>
      </Helmet>

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