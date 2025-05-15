import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import ToastConfig from "./components/ui/ToastConfig";

function App() {
  return (
    <>
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { GlobalProvider } from './context/GlobalContext';
import AppRoutes from './Router';
import { ToastContainer } from 'react-toastify';
import ToastConfig from './components/ui/ToastConfig';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer {...ToastConfig} />
    </>
    </GlobalProvider>
  );
}

export default App;
