import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBCardBody,
  MDBIcon,
  MDBInput,
  MDBCard
} from 'mdb-react-ui-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import "./Style.css";

function Signup() {
  const location = useLocation();
  const signupType = location.state?.signupType;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    vehicleNumber: '',
    brpNumber: '',
    volunteer: signupType === 'volunteer'
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8888/api/signup', formData);
      console.log(response.data);
      navigate('/'); // Navigate to home page after successful registration
    } catch (error) {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
      // Optionally, handle error state in your component
    }
  };

  return (
    <div>
      <MDBCardBody style={{ marginLeft: "-5%", color: "whitesmoke" }}>
        <div className="d-flex flex-row align-items-center">
          <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
          <span className="h1 fw-bold mb-0 mt-4" style={{ fontSize: '3.5rem', marginLeft: "40%" }}>
            VAS LIFT ASSIST
          </span>
        </div>
        <div className="d-flex justify-content-center align-items-start mt-5">
          <MDBCard style={{ marginRight: '45%', backgroundColor: "#fffdd0", padding: "1.4%", borderRadius: "15px", width: "30%", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
            <MDBCardBody>
              <div className="text-center mb-4">
                <h3>Create your account</h3>
              </div>
  
              <form onSubmit={handleSubmit}>
                <div className="input-wrapper mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{marginTop: '1%', fontSize: "140%"}} htmlFor="firstName" className="form-label">First Name</label>
                  <MDBInput id="firstName" type="text" size="lg" className="flex-grow-1" value={formData.firstName} onChange={handleInputChange} required />
                </div>
  
                <div className="input-wrapper mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{marginTop: '1%', fontSize: "140%"}} htmlFor="lastName" className="form-label">Last Name</label>
                  <MDBInput id="lastName" type="text" size="lg" className="flex-grow-1" value={formData.lastName} onChange={handleInputChange} required />
                </div>
  
                <div className="input-wrapper mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{marginTop: '1%', fontSize: "140%"}} htmlFor="emailId" className="form-label">Email address</label>
                  <MDBInput id="emailId" type="email" size="lg" className="flex-grow-1" value={formData.emailId} onChange={handleInputChange} required />
                </div>
  
                {signupType === 'volunteer' && (
                  <div className="input-wrapper mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                    <label style={{marginTop: '1%', fontSize: "140%"}} htmlFor="vehicleNumber" className="form-label">Vehicle No.</label>
                    <MDBInput id="vehicleNumber" type="text" size="lg" className="flex-grow-1" value={formData.vehicleNumber} onChange={handleInputChange} required />
                  </div>
                )}
  
                <div className="input-wrapper mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{marginTop: '1%', fontSize: "140%"}} htmlFor="password" className="form-label">Password</label>
                  <MDBInput id="password" type="password" size="lg" className="flex-grow-1" value={formData.password} onChange={handleInputChange} required />
                </div>
  
                <div className="input-wrapper mb-4" style={{ display: "flex", justifyContent: "space-between" }}>
                  <label style={{marginTop: '1%', fontSize: "140%"}} htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <MDBInput id="confirmPassword" type="password" size="lg" className="flex-grow-1" value={formData.confirmPassword} onChange={handleInputChange} required />
                </div>
  
                <Button type="submit" className="text-center mt-4" style={{ fontSize: "25px" }}>
                  Register
                </Button>
              </form>
            </MDBCardBody>
          </MDBCard>
        </div>
      </MDBCardBody>
    </div>
  );
  
  
}

export default Signup;
