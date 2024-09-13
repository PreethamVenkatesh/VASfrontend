import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBCardBody,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function SignUpRequester() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8888/users', formData);
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <MDBCardBody style={{ marginLeft: "-5%", color: "whitesmoke" }}>
        <div className='d-flex flex-row'>
          <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
          <span className="h1 fw-bold mb-0 mt-4" style={{ fontSize: '3.5rem', marginLeft: "40%" }}>VAS LIFT ASSIST</span>
        </div>
  
        <div>
          <form onSubmit={handleSubmit} className='text-center'>
            <div style={{ marginRight: "50%" }}>
              <h3>Create your account</h3>
            </div>
  
            <div className='text-center mt-5'>
              <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "28%", display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="firstName" className="form-label">First Name</label>
                <MDBInput id='firstName' type='text' size="lg" className="flex-grow-1" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "28%", display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <MDBInput id='lastName' type='text' size="lg" className="flex-grow-1" value={formData.lastName} onChange={handleInputChange} required />
              </div>
              <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "28%", display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="emailId" className="form-label">Email address</label>
                <MDBInput id='emailId' type='email' size="lg" className="flex-grow-1" value={formData.emailId} onChange={handleInputChange} required />
              </div>
              <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "28%", display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <MDBInput id='phoneNumber' type='text' size="lg" className="flex-grow-1" value={formData.phoneNumber} onChange={handleInputChange} required />
              </div>
              <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "28%", display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="password" className="form-label">Password</label>
                <MDBInput id='password' type='password' size="lg" className="flex-grow-1" value={formData.password} onChange={handleInputChange} required />
              </div>
              <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "28%", display: "flex", justifyContent: "space-between" }}>
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <MDBInput id='confirmPassword' type='password' size="lg" className="flex-grow-1" value={formData.confirmPassword} onChange={handleInputChange} required />
              </div>
            </div>
  
            <Button type="submit" className='text-center mt-5' style={{ marginRight: "50%", fontSize: "25px" }}>
              Register
            </Button>
          </form>
        </div>
      </MDBCardBody>
    </div>
  );
  
}

export default SignUpRequester;
