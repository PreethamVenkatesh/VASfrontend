import React, { useState } from 'react';
import axios from 'axios';
import { MDBCardBody, MDBIcon, MDBInput, MDBCard } from 'mdb-react-ui-kit';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Style.css';

function Signup() {
  const location = useLocation();
  const signupType = location.state?.signupType;
  const [formData, setFormData] = useState({ // Setting up the initial form data with state hooks
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    volunteer: signupType === 'volunteer',
    confirmPassword: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  // Function to handle input changes dynamically
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Function to validate the passwor
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  // Function to validate the passwor
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;
    if (!validatePassword(password)) {
      setErrorMessage(
        'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setErrorMessage('');

    try {
      // Sending a POST request to the signup API with form data
      const response = await axios.post('http://localhost:8888/api/signup', formData);
      console.log(response.data);
      toast.success('User signed up successfully');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error registering user:', error.response ? error.response.data : error.message);
      toast.error('Error in creating user');
    }
  };

  // Function to navigate back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <MDBCardBody className="d-flex flex-column align-items-center" style={{ color: 'whitesmoke' }}>
        <div className="d-flex flex-column flex-lg-row align-items-center text-center text-lg-left">
          {/* Header with icon and app name */}
          <MDBIcon fas icon="cubes fa-3x mb-3 mb-lg-0 me-lg-3" style={{ color: '#ff6219' }} />
          <span className="h1 fw-bold mb-0" style={{ fontSize: '3rem' }}>
            VAS LIFT ASSIST
          </span>
        </div>
        <div className="d-flex justify-content-center align-items-start mt-5">
          <MDBCard
            className="w-100 w-lg-50 p-4"
            style={{
              backgroundColor: '#fffdd0',
              borderRadius: '15px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <MDBCardBody>
              <div className="text-center mb-4">
                <h3>Create your account</h3>
              </div>
              <form onSubmit={handleSubmit}>
                {/* First Name input */}
                <div className="input-wrapper mb-1 d-flex flex-column flex-lg-row align-items-center">
                  <label
                    htmlFor="firstName"
                    className="form-label mb-2 mb-lg-0 text-lg-right"
                    style={{ fontSize: '1.2rem' }}
                  >
                    First Name
                  </label>
                  <MDBInput
                    id="firstName"
                    type="text"
                    size="lg"
                    className="w-100 w-lg-75"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Last Name input */}
                <div className="input-wrapper mb-1 d-flex flex-column flex-lg-row align-items-center">
                  <label
                    htmlFor="lastName"
                    className="form-label mb-2 mb-lg-0 text-lg-right"
                    style={{ fontSize: '1.2rem' }}
                  >
                    Last Name
                  </label>
                  <MDBInput
                    id="lastName"
                    type="text"
                    size="lg"
                    className="w-100 w-lg-75"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Email input */}
                <div className="input-wrapper mb-1 d-flex flex-column flex-lg-row align-items-center">
                  <label
                    htmlFor="emailId"
                    className="form-label mb-2 mb-lg-0 text-lg-right"
                    style={{ fontSize: '1.2rem' }}
                  >
                    Email address
                  </label>
                  <MDBInput
                    id="emailId"
                    type="email"
                    size="lg"
                    className="w-100 w-lg-75"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Password input */}
                <div className="input-wrapper mb-1 d-flex flex-column flex-lg-row align-items-center">
                  <label
                    htmlFor="password"
                    className="form-label mb-2 mb-lg-0 text-lg-right"
                    style={{ fontSize: '1.2rem' }}
                  >
                    Password
                  </label>
                  <MDBInput
                    id="password"
                    type="password"
                    size="lg"
                    className="w-100 w-lg-75"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {/* Confirm Password input */}
                <div className="input-wrapper mb-1 d-flex flex-column flex-lg-row align-items-center">
                  <label
                    htmlFor="confirmPassword"
                    className="form-label mb-2 mb-lg-0 text-lg-right"
                    style={{ fontSize: '1.2rem' }}
                  >
                    Confirm Password
                  </label>
                  <MDBInput
                    id="confirmPassword"
                    type="password"
                    size="lg"
                    className="w-100 w-lg-75"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {errorMessage && (
                  <div className="text-danger text-center mb-3">
                    {errorMessage}
                  </div>
                )}
                {/* Buttons for Back and Register */}
                <div className="d-flex justify-content-between mt-4">
                  <Button type="button" className="w-100 me-2" onClick={handleBack}>
                    Back
                  </Button>
                  <Button type="submit" className="text-center w-100 ms-2">
                    Register
                  </Button>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </div>
      </MDBCardBody>

      <ToastContainer />
    </div>
  );
}

export default Signup;
