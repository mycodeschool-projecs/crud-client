import React from 'react';
import './App.css';
import Home from "./components/Home";
import SecurityCheck from "./components/SecurityCheck";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Notifications from "./components/Notifications";
import Navbar from "./components/Navbar";
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from "./utile/keycloack";
import KeycloakLogin from "./components/KeycloakLogin/KeycloakLogin";

function App() {
    const keycloakInitOptions = {
        onLoad: 'check-sso',
        pkceMethod: 'S256', // Recomandat, asigură-te că este activat și în Keycloak la client (PKCE Code Challenge Method S256)
        checkLoginIframe: false, // <-- Adaugă această linie pentru test
    };
  return (
    // <Router>
    //   <div className="app-container">
    //     <Navbar />
    //     <div className="content-container">
    //       <Routes>
    //         <Route path="/" element={<SecurityCheck />} />
    //         <Route path="/login" element={<Login />} />
    //         <Route path="/register" element={<Register />} />
    //         <Route path="/adduser" element={<Home />} />
    //         <Route path="/notifications" element={<Notifications />} />
    //       </Routes>
    //     </div>
    //   </div>
    // </Router>
      <ReactKeycloakProvider authClient={keycloak} initOptions={keycloakInitOptions}>
        <Router>
          <div className="App">
            <Routes>
              {/* Afișează CustomLoginForm la calea de bază */}
              <Route path="/" element={<KeycloakLogin />} />
              {/*<Route path="/" element={<KeycloakLogin/>} />*/}
              {/* Momentan, NICI O ALTĂ RUTĂ SAU COMPONENTĂ AICI! */}
            </Routes>
          </div>
        </Router>
      </ReactKeycloakProvider>
  );
}

export default App;
