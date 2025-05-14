import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import ToastConfig from "./components/ui/ToastConfig";

function App() {
  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
      <ToastContainer {...ToastConfig} />
    </>
  );
}

export default App;
