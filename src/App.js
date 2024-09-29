import React from 'react';
//Imported components from the 'volunteer' folder
import Login from './volunteer/Login';
import Signup from './volunteer/Signup';
import HomePage from './volunteer/HomePage';
import Security from './volunteer/Security';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
//Imported components from the 'component' folder
import CustomerDashboard from './component/CustomerDashboard';
import SignUpRequester from './component/SignUpRequester';
import PastAssist from './component/PastAssist';
import RequestAssist from './component/RequestAssist';
import CurrentAssist from './component/CurrentAssist';
import FutureAssist from './component/FutureAssist';
import CustomerAccount from './component/CustomerAccount';
import Help from './component/Help';
import FAQ from './component/FAQs';
import Navigation from './volunteer/Navigation';
import MapRide from './component/MapRide';

function App() {
  return (
    <Router> {/* Wrap the application in the Router component to enable routing */}
      <div className="App">
        <Routes> {/* Define the routes for different parts of the application */}
          {/* Each Route defines a specific path and the component that should render at that path */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/custregister" element={<SignUpRequester />} />
          <Route path='/pastAssist' element={<PastAssist />} />
          <Route path='/requestAssist' element={<RequestAssist />} />
          <Route path='/currentAssist' element={<CurrentAssist />} />
          <Route path='/futureAssist' element={<FutureAssist />} />
          <Route path='/account' element={<CustomerAccount />} />
          <Route path='/help' element={<Help />} />
          <Route path='/faqs' element={<FAQ />} />
          <Route path="/navigation" element={<Navigation />} />
          <Route path="/mapRide" element={<MapRide />} />

          {/* Routes below are guarded by the Security component and the user must login to access them */}
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

export default App; // Export the App component as the default export
