import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Home from "./components/Home";
import SecurityCheck from "./components/SecurityCheck";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import {loadConfig} from "./utile/utile";

function App() {

  return (
      <Router>
          <Routes>
              {/*<Route path="/" element={<SecurityCheck />} />*/}

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path={"/adduser"} element={<Home />}/>
          </Routes>
      </Router>
    // <div className="App">
    //   <SecurityCheck/>
    // </div>
  );
}

export default App;
