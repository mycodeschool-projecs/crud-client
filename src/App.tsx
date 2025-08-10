import React from 'react';
import './App.css';
import Home from "./components/Home";
import SecurityCheck from "./components/SecurityCheck";
import { BrowserRouter as Router, Routes, Route,Outlet } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Notifications from "./components/Notifications";
import Navbar from "./components/Navbar";
import KeycloakLogin from "./components/KeycloakLogin/index";

function LayoutWithNavbar() {
  return (
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Outlet />
        </div>
      </div>
  );
}



function App() {

// Layout cu Navbar



  return (
      <Router>
        <Routes>
          {/* Ruta fără Navbar */}
          <Route path="/" element={<KeycloakLogin />} />

          {/* Toate rutele de mai jos au Navbar */}
          <Route element={<LayoutWithNavbar />}>
            <Route path="/appsecurity" element={<SecurityCheck />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/adduser" element={<Home />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
  );
}

export default App;
