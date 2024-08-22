import React, { useState } from 'react';
import {
  MDBBtn,
  MDBCardBody,
  MDBIcon,
  MDBInput
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

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

  const handleSignupTypeSelect1 = (type) => {
    navigate('/custregister', { state: { signupType: type } });
  };

  const handleLogin = async () => {
    try {
      const apiUrl = loginType === 'volunteer' 
        ? 'http://localhost:8888/api/login' 
        : 'http://localhost:8888/api/custlogin';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: email, password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful", data.token);
        localStorage.setItem('token', data.token); // Save token to local storage

        if (loginType === 'volunteer') {
          navigate('/home'); // Navigate to HomePage for volunteers
        } else {
          navigate('/customerPage'); // Navigate to Customer Page for service requesters
        }
      } else {
        console.log(data.msg);
      }
    } catch (error) {
      console.log("Error logging in", error);
    }
  };

  return (
    <div className="custom-bg">
      <MDBCardBody style={{ marginLeft: "-5%", color: "whitesmoke" }}>
        <div className='d-flex flex-row justify-content-center'>
          <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
          <span className="h1 fw-bold mb-0 mt-5" style={{ fontSize: '3.5rem' }}>VAS LIFT ASSIST</span>
        </div>

        {showSignupButtons ? (
          <div className="my-4">
            <MDBBtn className="me-3" color='dark' onClick={() => handleSignupTypeSelect('volunteer')}>
              Signup as Volunteer
            </MDBBtn>
            <MDBBtn className="me-3" color='dark' onClick={() => handleSignupTypeSelect1('serviceRequester')}>
              Signup as Service Requester
            </MDBBtn>
            <div className='d-flex flex-row justify-content-start'>
              <button className="small text-muted me-1" style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer' }}>Terms of use.</button>
              <button className="small text-muted" style={{ background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer' }}>Privacy policy</button>
            </div>
          </div>
        ) : (
          <>
            {loginType === null ? (
              <div className="my-4 mt-5">
                <MDBBtn className="me-5" color='dark' onClick={() => handleLoginTypeSelect('volunteer')}>
                  Login as Volunteer
                </MDBBtn>
                <MDBBtn color='dark' onClick={() => handleLoginTypeSelect('lift')}>
                  Login to request a lift
                </MDBBtn>
                <p className="mb-5 pb-lg-5 mt-5" style={{ color: "whitesmoke" }}>
                  Don't have an account? <button style={{ color: "whitesmoke", background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer' }} onClick={handleRegisterClick}>Register here</button>
                </p>
              </div>
            ) : (
              <div className='text-center'>
                <h5 className="fw-normal my-4 pb-1" style={{ letterSpacing: '1px' }}>Sign into your account</h5>
                <div style={{ marginLeft: "40%" }}>
                  <div className="input-wrapper mb-4 text-center" style={{ display: "flex", justifyContent: "space-between", width: "35%" }}>
                    <label htmlFor="email" className="form-label mt-2">Email address</label>
                    <MDBInput id='email' type='email' size="lg" className="mx-auto" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="input-wrapper mb-4 text-center" style={{ display: "flex", justifyContent: "space-between", width: "35%" }}>
                    <label htmlFor="password" className="form-label mt-2">Password</label>
                    <MDBInput id='password' type='password' size="lg" className="mx-auto" style={{ maxWidth: '100%' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  <div className="input-wrapper mb-4 text-center" style={{ marginRight: "50%" }}>
                    <button className="small" style={{ color: "whitesmoke", background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer' }}>Forgot password?</button>
                  </div>
                </div>
                <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleLogin}>
                  Login
                </MDBBtn>

                <p className="mb-5 pb-lg-5" style={{ color: "whitesmoke", marginTop: "20%" }}>
                  Don't have an account? <button style={{ color: "whitesmoke", background: 'none', border: 'none', padding: 0, textDecoration: 'underline', cursor: 'pointer' }} onClick={handleRegisterClick}>Register here</button>
                </p>
              </div>
            )}
          </>
        )}
      </MDBCardBody>
    </div>
  );
}

export default Login;
