import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfileSetup from "./pages/ProfileSetUp";
import { getUser } from "./api/userApi";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile"  element={<ProfileSetup />} /> 
      </Routes>
    </Router>
  );
}

export default App;
