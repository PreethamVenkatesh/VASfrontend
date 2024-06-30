import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import ambulanceImage from '../images/Ambulance4.jpg';

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
    <div className="custom-bg">
      <MDBContainer className="my-5">
        <MDBCard>
          <MDBRow className='g-1'>
            <MDBCol md='7'>
              <MDBCardImage src={ambulanceImage} alt="login form" className='rounded-start w-100'/>
            </MDBCol>
            <MDBCol md='5'>
              <MDBCardBody className='d-flex flex-column'>
                <div className='d-flex flex-row mt-3'>
                  <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }}/>
                  <span className="h1 fw-bold mb-0" style={{ fontSize: '3.5rem' }}>VAS LIFT ASSIST</span>
                </div>

                <div>
                  <h3 className="text-center mb-4">Create your account</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="input-wrapper mb-4">
                      <label htmlFor="firstName" className="form-label">First Name</label>
                      <MDBInput id='firstName' type='text' size="lg" className="flex-grow-1" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="input-wrapper mb-4">
                      <label htmlFor="lastName" className="form-label">Last Name</label>
                      <MDBInput id='lastName' type='text' size="lg" className="flex-grow-1" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className="input-wrapper mb-4">
                      <label htmlFor="emailId" className="form-label">Email address</label>
                      <MDBInput id='emailId' type='email' size="lg" className="flex-grow-1" value={formData.emailId} onChange={handleInputChange} required />
                    </div>

                    {signupType === 'volunteer' && (
                      <>
                        <div className="input-wrapper mb-4">
                          <label htmlFor="vehicleNumber" className="form-label">Vehicle No.</label>
                          <MDBInput id='vehicleNumber' type='text' size="lg" className="flex-grow-1" value={formData.vehicleNumber} onChange={handleInputChange} required />
                        </div>
                        <div className="input-wrapper mb-4">
                          <label htmlFor="brpNumber" className="form-label">BRP No.</label>
                          <MDBInput id='brpNumber' type='text' size="lg" className="flex-grow-1" value={formData.brpNumber} onChange={handleInputChange} required />
                        </div>
                      </>
                    )}

                    <div className="input-wrapper mb-4">
                      <label htmlFor="password" className="form-label">Password</label>
                      <MDBInput id='password' type='password' size="lg" className="flex-grow-1" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    <div className="input-wrapper mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <MDBInput id='confirmPassword' type='password' size="lg" className="flex-grow-1" onChange={handleInputChange} required />
                    </div>
                    <MDBBtn className="w-100 mb-4" color='dark' size='lg' type='submit'>
                      Register
                    </MDBBtn>
                  </form>
                </div>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Signup;
