import React from 'react';
import Login from './component/Login';
import Signup from './component/Signup';
import HomePage from './component/HomePage';
import CustomerDashboard from './component/CustomerDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUpRequester from './component/SignUpRequester';
import PastAssist from './component/PastAssist';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/custregister" element={<SignUpRequester />} />
          <Route path='/pastAssist' element={PastAssist} />
          <Route
            path="/home"
            element={
              <security>
                <HomePage />
              </security>
            }
          />
          <Route
            path="/customerPage"
            element={
              <security>
                <CustomerDashboard />
              </security>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
