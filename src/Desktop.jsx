import React from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./CssFiles/Desktop.css";

export default function Desktop() {
  const location = useLocation();
  const { userName } = location.state || {};

  return (
    <div className="desktop">
      <Helmet>
          <title>Desktop</title>
      </Helmet>
    </div>
  );
}