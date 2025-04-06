import React from "react";
import Login from "./Login";
import Desktop from "./Desktop";
import Ending from "./Ending";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Create a protected route component
const ProtectedEnding = () => {
  const location = useLocation();
  
  // Check if we have valid ending state
  if (!location.state || !['bad', 'good'].includes(location.state.endingType)) {
    return <Navigate to="/Desktop" replace />;
  }

  return <Ending />;
};

export default () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<Login />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Desktop" element={<Desktop />} />
      <Route 
        path="/Ending" 
        element={<ProtectedEnding />} 
      />
    </Routes>
  </BrowserRouter>
);