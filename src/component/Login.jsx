import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import ambulanceImage from '../images/Ambulance4.jpg';

function Login() {
  const [loginType, setLoginType] = useState(null);
  const [showSignupButtons, setShowSignupButtons] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLoginTypeSelect = (type) => {
    setLoginType(type);
  };

  const handleRegisterClick = () => {
    setShowSignupButtons(true);
  };

  const handleSignupTypeSelect = (type) => {
    navigate('/signup', { state: { signupType: type } });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/login', { // Update the URL as needed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: email, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data.token);
        localStorage.setItem('token', data.token); // Save token to local storage
        navigate('/home'); 
      } else {
        console.log(data.msg);
      }
    } catch (error) {
      console.log("Error logging in", error);
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

                {showSignupButtons ? (
                  <div className="my-4">
                    <MDBBtn className="me-3" color='dark' onClick={() => handleSignupTypeSelect('volunteer')}>
                      Signup as Volunteer
                    </MDBBtn>
                    <MDBBtn className="me-3" color='dark' onClick={() => handleSignupTypeSelect('serviceRequester')}>
                      Signup as Service Requester
                    </MDBBtn>
                    <div className='d-flex flex-row justify-content-start'>
                      <a href="#!" className="small text-muted me-1">Terms of use.</a>
                      <a href="#!" className="small text-muted">Privacy policy</a>
                    </div>
                  </div>
                ) : (
                  <>
                    {loginType === null ? (
                      <div className="my-4">
                        <MDBBtn className="me-3" color='dark' onClick={() => handleLoginTypeSelect('volunteer')}>
                          Login as Volunteer
                        </MDBBtn>
                        <MDBBtn color='dark' onClick={() => handleLoginTypeSelect('lift')}>
                          Login to request a lift
                        </MDBBtn>
                        <p className="mb-5 pb-lg-5" style={{ color: '#393f81' }}>
                          Don't have an account? <a href="#!" style={{ color: '#393f81' }} onClick={handleRegisterClick}>Register here</a>
                        </p>
                        <div className='d-flex flex-row justify-content-start'>
                          <a href="#!" className="small text-muted me-1">Terms of use.</a>
                          <a href="#!" className="small text-muted">Privacy policy</a>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h5 className="fw-normal my-4 pb-1" style={{ letterSpacing: '1px' }}>Sign into your account</h5>
                        <div className="input-wrapper mb-4">
                          <label htmlFor="email" className="form-label">Email address</label>
                          <MDBInput id='email' type='email' size="lg" className="flex-grow-1" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="input-wrapper mb-4">
                          <label htmlFor="password" className="form-label">Password</label>
                          <MDBInput id='password' type='password' size="lg" className="flex-grow-1" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleLogin}>
                          Login
                        </MDBBtn>
                        <div className="mb-3">
                          <a className="small text-muted" href="#!">Forgot password?</a>
                        </div>
                        <p className="mb-5 pb-lg-5" style={{ color: '#393f81' }}>
                          Don't have an account? <a href="#!" style={{ color: '#393f81' }} onClick={handleRegisterClick}>Register here</a>
                        </p>
                        <div className='d-flex flex-row justify-content-start'>
                          <a href="#!" className="small text-muted me-1">Terms of use.</a>
                          <a href="#!" className="small text-muted">Privacy policy</a>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBContainer>
    </div>
  );
}

export default Login;
