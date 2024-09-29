// Importing necessary libraries and modules
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import ProfImg from '../images/BlankProfilePic.webp';
import { Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CustHome from './Modals/CustHome';
import CustWork from './Modals/CustWork';
import { FaArrowLeft } from 'react-icons/fa';

function CustomerAccount() {
    // Get the JWT token from local storage
  const token = localStorage.getItem('token');

  // State for user data
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
  });

  // State to manage edit mode for each field
  const [editMode, setEditMode] = useState({
    firstName: false,
    lastName: false,
    emailId: false,
    phoneNumber: false,
  });

  // Handle changes to user input
  const editUser = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

    // State for profile picture
  const [profilePic, setProfilePic] = useState(ProfImg)

  // Toggle edit mode for a specific field
  const toggleEditMode = (field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [field]: !prevEditMode[field],
    }));
  
    // If exiting edit mode, update the user data
    if (editMode[field]) {
      const updatedUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailId: userData.emailId,
        phoneNumber: userData.phoneNumber,
      };
      
      // Decode token to get email ID for the PUT request
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.emailId;
  
      // Update user information via API
      axios
        .put(`http://localhost:8888/api/custupdate`, { emailId: decodedEmail, ...updatedUser })
        .then((res) => {
          console.log('User updated successfully:', res.data);
        })
        .catch((error) => {
          console.error('Error updating user:', error);
        });
    }
  };
  
  // Handle profile picture change
  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  // Hook for navigation
  const navigate  = useNavigate();

  // Handle sign out action
  const handleSignOut = () => {
    localStorage.clear();
  navigate('/')
  };

  // Fetch user details from the server
  const fetchUserDetails = () => {
    if (token) {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.emailId;
      axios
        .get(`http://localhost:8888/api/custdetails?emailId=${decodedEmail}`)
        .then((res) => {
          setUserData({
            ...userData,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            emailId: res.data.emailId,
            phoneNumber: res.data.phoneNumber,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [token]);

  return (
    <div style={{minHeight: '100vh', backgroundColor: 'yellow',padding: '20px'}}>
      {/* Back button to navigate to the previous page */}
      <div
        style={{position: 'absolute',left: '60px',top: '30px',cursor: 'pointer',display: 'flex',alignItems: 'center'}}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>
      <h1 style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline',fontSize: '40px'}}>
        Account
      </h1>
      <Row>
        <Col style={{ marginLeft: '10%', marginTop: '5%' }}>
          <Card style={{ width: '20rem' }}>
            {/* Profile picture section */}
          <div style={{ height: '200px', width: '100%', position: 'relative' }}>
              <img
                src={profilePic}
                alt="Profile"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  height: '100%',
                  width: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
            <Card.Body>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Change Profile Picture</Form.Label>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    style={{ display: 'none' }}
                    id="profilePicInput"
                  />
                  <Button
                    variant="primary"
                    onClick={() => document.getElementById('profilePicInput').click()}
                  >
                    Upload Image
                  </Button>
                </div>
              </Form.Group>
              <Card.Title>
                <b>PROFILE INFO</b>
              </Card.Title>
            </Card.Body>
            {userData && (
              <ListGroup className="list-group-flush">
                {/* User data fields with edit functionality */}
                <ListGroup.Item>
                  <b>First Name </b>
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => toggleEditMode('firstName')}
                  />
                  <br />
                  {editMode.firstName ? (
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={editUser}
                      onBlur={() => toggleEditMode('firstName')}
                    />
                  ) : (
                    userData.firstName
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Last Name </b>
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => toggleEditMode('lastName')}
                  />
                  <br />
                  {editMode.lastName ? (
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={editUser}
                      onBlur={() => toggleEditMode('lastName')}
                    />
                  ) : (
                    userData.lastName
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Email </b>
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => toggleEditMode('emailId')}
                  />
                  <br />
                  {editMode.emailId ? (
                    <Form.Control
                      type="text"
                      name="emailId"
                      value={userData.emailId}
                      onChange={editUser}
                      onBlur={() => toggleEditMode('emailId')}
                    />
                  ) : (
                    userData.emailId
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <b>Phone Number </b>
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                    onClick={() => toggleEditMode('phoneNumber')}
                  />
                  <br />
                  {editMode.phoneNumber ? (
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={userData.phoneNumber}
                      onChange={editUser}
                      onBlur={() => toggleEditMode('phoneNumber')}
                    />
                  ) : (
                    userData.phoneNumber
                  )}
                </ListGroup.Item>
              </ListGroup>
            )}
          </Card>
        </Col>
        <Col md={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card style={{ width: '20rem', marginRight: '3%' }}>
            <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <FontAwesomeIcon icon={faCog} size="2x" style={{ marginRight: '10px' }} />
                <Card.Title style={{ textAlign: 'center' }}>
                  <b>Settings</b>
                </Card.Title>
              </div>
              <CustHome /> {/* Custom Home settings modal */}
              <CustWork /> {/* Custom Work settings modal */}
              <Button variant="danger" onClick={handleSignOut}>
                Sign Out {/* Sign out button */}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CustomerAccount;
