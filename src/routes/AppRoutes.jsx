import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProfileSetup from "../pages/ProfileSetUp";
import Home from "../pages/Dashboard/Home";
import Chat from "../pages/Dashboard/Chat";
import Map from "../pages/Dashboard/Map";
import Profile from "../pages/Dashboard/Profile";
import Favorites from "../pages/Dashboard/Favorites";
import Navbar from "../components/ui/NavBar";
import 'react-toastify/dist/ReactToastify.css';

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/map" element={<Map />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/setup" element={<ProfileSetup />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
