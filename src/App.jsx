import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; 

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ProfileSetup from "./pages/ProfileSetUp";
import Home from "./pages/Dashboard/Home";
import Chat from "./pages/Dashboard/Chat";
import Map from "./pages/Dashboard/Map";
import Profile from "./pages/Dashboard/Profile";
import Favorites from "./pages/Dashboard/Favorites";
import Settings from "./pages/Dashboard/Settings";

function App() {
  return (
    <Router>
      <Toaster /> 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/map" element={<Map />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/setup" element={<ProfileSetup />} />
        <Route path="/Settings" element={<Settings/>} />
      </Routes>
    </Router>
  );
}

export default App;
