import React from 'react';
import Login from './volunteer/Login';
import Signup from './volunteer/Signup';
import HomePage from './volunteer/HomePage';
import Security from './volunteer/Security';
import CustomerDashboard from './component/CustomerDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUpRequester from './component/SignUpRequester';
import PastAssist from './component/PastAssist';
import RequestAssist from './component/RequestAssist';
import CurrentAssist from './component/CurrentAssist';
import FutureAssist from './component/FutureAssist';
import CustomerAccount from './component/CustomerAccount';
import Help from './component/Help';
import FAQ from './component/FAQs';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/custregister" element={<SignUpRequester />} />
          <Route path='/pastAssist' element={<PastAssist />} />
          <Route path='/requestAssist' element={<RequestAssist />} />
          <Route path='/currentAssist' element={CurrentAssist} />
          <Route path='/futureAssist' element={FutureAssist} />
          <Route path='/account' element={<CustomerAccount />} />
          <Route path='/help' element={Help} />
          <Route path='/faqs' element={FAQ} />
          <Route
            path="/home"
            element={
              <Security>
                <HomePage />
              </Security>
            }
          />
          <Route
            path="/customerPage"
            element={
              <Security>
                <CustomerDashboard />
              </Security>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
