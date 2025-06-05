import React from 'react';
import './App.css';
import Home from "./components/Home";
import SecurityCheck from "./components/SecurityCheck";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Notifications from "./components/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SecurityCheck />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adduser" element={<Home />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
