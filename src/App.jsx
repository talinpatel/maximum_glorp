import React from "react"
import Login from "./Login";
import Desktop from "./Desktop";
import Ending from "./Ending";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default () => (
  <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Desktop" element={<Desktop />} />
          <Route path="/Ending" element={<Ending />} />
        </Routes>
      </BrowserRouter>
      
  </>
);
