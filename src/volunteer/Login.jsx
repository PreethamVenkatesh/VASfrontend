import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBCardBody, MDBIcon, MDBInput } from 'mdb-react-ui-kit'; // Importing components from MDBReact UI Kit
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importing jwtDecode to decode JWT tokens

// Login frontend component
function Login() {
  const [loginType, setLoginType] = useState(null);
  const [showSignupButtons, setShowSignupButtons] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate(); // useNavigate hook for navigation between routes

  // useEffect hook to populate remembered emailId and password if 'Remember me' was previously checked
  useEffect(() => {
    if (loginType === 'lift') {
      const storedEmail = localStorage.getItem('rememberedEmail');
      const storedPassword = localStorage.getItem('rememberedPassword');
      const storedRememberMe = localStorage.getItem('rememberMe') === 'true';

      if (storedRememberMe) {
        setEmail(storedEmail || '');
        setPassword(storedPassword || '');
        setRememberMe(storedRememberMe);
      }
    }
  }, [loginType]); // Re-run this effect whenever loginType changes

  const handleLoginTypeSelect = (type) => { // Function to handle login type selection
    setLoginType(type);
  };

  const handleRegisterClick = () => { // Function to display signup buttons when 'Register' is clicked
    setShowSignupButtons(true);
  };

  const handleSignupTypeSelect = (type) => {  // Function to handle signup selection for 'Volunteer'
    navigate('/signup', { state: { signupType: type } }); // Navigate to signup page for volunteers
  };

  const handleSignupTypeSelect1 = (type) => { // Function to handle signup selection for 'Service Requester'
    navigate('/custregister', { state: { signupType: type } }); // Navigate to signup page for customers
  };

  const handleLogin = async () => { // Function to handle login submission
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
        localStorage.setItem('token', data.token);  // Store token in localStorage

        if (loginType === 'lift' && rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberMe', true);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
        }

        if (loginType === 'volunteer') {
          navigate('/home');  // Navigate to home page for volunteers
        } else {
          const token = localStorage.getItem('token');
          if (token) {
            const decoded = jwtDecode(token); // Decode the JWT token
            const decodedEmail = decoded.emailId;
            localStorage.setItem('emailId', decodedEmail);  // Store decoded email in localStorage
            navigate('/customerPage');  // Navigate to customer page
          }
        }
      } else {
        console.log(data.msg);
      }
    } catch (error) {
      console.log("Error logging in", error);
    }
  };

  const handleBackClick = () => { // Function to handle back button click
    if (showSignupButtons) {
      setShowSignupButtons(false); 
    } else {
      setLoginType(null); 
    }
  };

  return (
    <div className="custom-bg">
      <MDBCardBody className="d-flex flex-column align-items-center" style={{ color: 'whitesmoke' }}>
        <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center text-center">
          <MDBIcon fas icon="cubes fa-3x me-lg-3 mb-3 mb-lg-0" style={{ color: '#ff6219' }} />
          <span className="h1 fw-bold mb-0 mt-lg-5" style={{ fontSize: '3.5rem' }}>VAS LIFT ASSIST</span>
        </div>

        {/* Conditionally render signup buttons if showSignupButtons is true */}
        {showSignupButtons ? (
          <div className="my-4 text-center">
            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center">
              <MDBBtn className="my-2 mx-2" color="dark" onClick={() => handleSignupTypeSelect('volunteer')}>
                Signup as Volunteer
              </MDBBtn>
              <MDBBtn className="my-2 mx-2" color="dark" onClick={() => handleSignupTypeSelect1('serviceRequester')}>
                Signup as Service Requester
              </MDBBtn>
            </div>
            <MDBBtn className="my-2" color="secondary" onClick={handleBackClick}>
              Back
            </MDBBtn>
            <div className="d-flex flex-column flex-md-row justify-content-center mt-3">
              <button className="small text-muted my-1 mx-2" style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                Terms of use
              </button>
              <button className="small text-muted my-1 mx-2" style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                Privacy policy
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* If loginType is not selected, show login options */}
            {loginType === null ? (
              <div className="my-4 text-center">
                <MDBBtn className="my-2 mx-2" color="dark" onClick={() => handleLoginTypeSelect('volunteer')}>
                  Login as Volunteer
                </MDBBtn>
                <MDBBtn className="my-2 mx-2" color="dark" onClick={() => handleLoginTypeSelect('lift')}>
                  Login to request a lift
                </MDBBtn>
                <p className="mb-5 mt-5 pb-lg-5" style={{ color: 'whitesmoke' }}>
                  Don't have an account?{' '}
                  <button
                    style={{ color: 'whitesmoke', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={handleRegisterClick}
                  >
                    Register here
                  </button>
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h5 className="fw-normal my-4 pb-1" style={{ letterSpacing: '1px' }}>Sign into your account</h5>
                <div className="w-100 d-flex flex-column align-items-center">
                  <div className="input-wrapper mb-4 d-flex flex-column align-items-center w-100 px-lg-5">
                    <label htmlFor="email" className="form-label mt-2">Email address</label>
                    <MDBInput id="email" type="email" size="lg" className="w-100 w-lg-50" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="input-wrapper mb-4 d-flex flex-column align-items-center w-100 px-lg-5">
                    <label htmlFor="password" className="form-label mt-2">Password</label>
                    <MDBInput id="password" type="password" size="lg" className="w-100 w-lg-50" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                  {loginType === 'lift' && (
                    <div className="form-check mb-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                  )}
                  <div className="input-wrapper mb-4 text-center">
                    <button className="small" style={{ color: 'whitesmoke', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                      Forgot password?
                    </button>
                  </div>
                </div>
                <MDBBtn className="mb-4 px-5" color="dark" size="lg" onClick={handleLogin}>
                  Login
                </MDBBtn>
                <MDBBtn className="mb-4 px-5" color="secondary" size="lg" onClick={handleBackClick}>
                  Back
                </MDBBtn>

                <p className="mb-5 pb-lg-5 mt-lg-5" style={{ color: 'whitesmoke' }}>
                  Don't have an account?{' '}
                  <button
                    style={{ color: 'whitesmoke', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={handleRegisterClick}
                  >
                    Register here
                  </button>
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