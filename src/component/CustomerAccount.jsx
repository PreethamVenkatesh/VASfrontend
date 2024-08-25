import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import ProfImg from '../images/BlankProfilePic.webp';
import { Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'
import { faEditing, faCog } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CustHome from './Modals/CustHome';
import CustWork from './Modals/CustWork';

function CustomerAccount() {
  const token = localStorage.getItem('token');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
  });
  const [editMode, setEditMode] = useState({
    firstName: false,
    lastName: false,
    emailId: false,
    phoneNumber: false,
  });

  const editUser = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [profilePic, setProfilePic] = useState(ProfImg)

  const toggleEditMode = (field) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [field]: !prevEditMode[field],
    }));
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result); // Update the profile picture preview
      };
      reader.readAsDataURL(file);
    }
  };

const navigate  = useNavigate();

  const handleSignOut = () => {
    // Handle sign out logic
    localStorage.clear();
    // window.location.href = '/login'; // Redirect to login page
  navigate('/')
  };

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

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  useEffect(() => {
    fetchUserDetails();
  }, [token]);

  return (
    <div>
      <h1 style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline' }}>
        Account
      </h1>
      <Row>
        <Col style={{ marginLeft: '10%', marginTop: '5%' }}>
          <Card style={{ width: '20rem' }}>
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
              <CustHome />
              <CustWork />
              <Button variant="danger" onClick={handleSignOut}>
                Sign Out
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CustomerAccount;