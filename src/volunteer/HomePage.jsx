import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCol, MDBRow, MDBListGroup,
  MDBListGroupItem, MDBFooter, MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import useGoogleMaps from './GoogleMaps';
import Modal from 'react-modal'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Style.css";

Modal.setAppElement('#root');

function HomePage() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(true);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [center, setCenter] = useState({ lat: 51.6214, lng: -3.9436 }); // Default to Swansea
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [destination, setDestination] = useState(null);
  const [locations, setLocations] = useState([]);
  const [verifyVehicle, setVerifyVehicle] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('Unavailable');
  const [showAvailabilityButtons, setShowAvailabilityButtons] = useState(true);
  const navigate = useNavigate();
  const [editableUser, setEditableUser] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
  });
  const { isLoaded } = useGoogleMaps(); // Use the custom hook

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setShowProfileCard(false);
    setShowAvailabilityButtons(false);
  };

  const handleBackClick = () => {
    setSelectedModule(null);
    setShowProfileCard(true);
    setShowAvailabilityButtons(true);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/', { replace: true });
        }
        const response = await axios.get('http://localhost:8888/api/user', {
          headers: {
            'Authorization': token
          }
        });
        const relativePath = response.data.profilePicture;
        setUser(response.data);
        setProfileImage(relativePath);

        setEditableUser({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          emailId: response.data.emailId,
        });
        // const locationsResponse = await axios.get(`http://localhost:8888/locations/${response.data.emailId}`);
        // setLocations(locationsResponse.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
    const startTracking = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lng: longitude });
            try {
              const token = localStorage.getItem('token');
              await axios.post('http://localhost:8888/api/update-location', 
                { latitude, longitude }, 
                { headers: { 'Authorization': token } }
              );
            } catch (error) {
              console.error('Error updating location:', error);
            }
          },
          (error) => {
            console.error("Error getting current location:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };
    startTracking();
  }, [navigate]);

  const AvailabilityToggle = async (status) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
  
      const availability = status === 'Available'; 
      const response = await axios.post('http://localhost:8888/api/update-availability', 
        { availability },
        { headers: { 'Authorization': token } }
      );
  
      if (response.status === 200) {
        console.log(response.data.msg);
        setAvailabilityStatus(status);
      } else {
        console.error('Failed to update availability:', response.data.msg); 
      }
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { firstName, lastName, emailId} = editableUser;
      const dataToSend = {
        firstName,
        lastName,
        emailId,
      };
      const response = await axios.put('http://localhost:8888/api/update-profile', dataToSend, {
        headers: {
          'Authorization': token
        }
      });
      setUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + (error.response ? error.response.data.msg : error.message));
    }
  };

  const fetchUpcomingRides = async () => {
    const token = localStorage.getItem('token');
    try {
      const userResponse = await axios.get('http://localhost:8888/api/user', {
      headers: {
        'Authorization': token,
      },
    });
    const emailId = userResponse.data.emailId;
    console.log("User's emailId is : " +emailId)
    const locationsResponse = await axios.get(`http://localhost:8888/api/locations/${emailId}`,{
      headers: {
        'Authorization': token,
      },
    });
    console.log("Location Response is: ", locationsResponse.data);
    const confirmedBookings = locationsResponse.data.filter(
      booking => booking.bookingStatus === 'Confirmed'
    );
    setLocations(confirmedBookings);
    } catch (error) {
      console.error('Error fetching upcoming rides:', error);
    }
  };

  const acceptPendingRides = async () => {
    const token = localStorage.getItem('token');
    try {
      const userResponse = await axios.get('http://localhost:8888/api/user', {
      headers: {
        'Authorization': token,
      },
    });
    const emailId = userResponse.data.emailId;
    console.log("User's emailId is : " +emailId)
    const locationsResponse = await axios.get(`http://localhost:8888/api/locations/${emailId}`,{
      headers: {
        'Authorization': token,
      },
    });
    console.log("Location Response is: ", locationsResponse.data);
    const confirmedBookings = locationsResponse.data.filter(
      booking => booking.bookingStatus === 'Pending'
    );
    setLocations(confirmedBookings);
    } catch (error) {
      console.error('Error fetching upcoming rides:', error);
    }
  };

  const handleAcceptClick = async (location) => {
    try {
      await axios.post('http://localhost:8888/api/update-booking-status', {
        bookingId: location._id,
        status: 'Confirmed'
      }, {
        headers: {
          'Authorization': localStorage.getItem('token'),
        },
      });
      acceptPendingRides();
    } catch (error) {
      console.error('Error accepting ride:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleAvailabilityToggle = (status) => {
    setAvailabilityStatus(status); 
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append('profilePicture', profileImage);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8888/api/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token
        }
      });
      const relativePath = response.data.profilePicturePath;
      setProfileImage(relativePath);
      alert('Profile picture uploaded successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture');
    }
  };

  const handleStartClick = async (location) => {
    try {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRequestToCustomer = {
        origin: center,
        destination: {
          lat: location.custLocationLat,
          lng: location.custLocationLong
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
      const directionsRequestToDestination = {
        origin: {
          lat: location.custLocationLat,
          lng: location.custLocationLong,
        },
        destination: {
          lat: location.destinationLat,
          lng: location.destinationLong,
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
      const [directionsToCustomer, directionsToDestination] = await Promise.all([
        new Promise((resolve, reject) => {
          directionsService.route(directionsRequestToCustomer, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              resolve(result);
            } else {
              reject(`Failed to get directions to customer: ${status}`);
            }
          });
        }),
        new Promise((resolve, reject) => {
          directionsService.route(directionsRequestToDestination, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              resolve(result);
            } else {
              reject(`Failed to get directions to destination: ${status}`);
            }
          });
        }),
      ]);
      setDirectionsResponse([directionsToCustomer, directionsToDestination]);
      console.log(location)
      setDestination(location);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const handleVerifyVehicle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8888/api/verify-vehicle', 
        { registrationNumber: vehicleNumber }, 
        {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.status === 200) {
        const { user, vehicleData } = response.data;
        if (vehicleData.motStatus === 'Valid') {
          toast.success('Vehicle status verification successful');
          setVerificationSuccess(true);
        } else {
          toast.error('Vehicle MOT status is not valid.');
          setVerificationSuccess(false);
        }
        console.log('User Data:', user);
        console.log('Vehicle Data:', vehicleData);
      } else {
        toast.error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error('Error verifying vehicle:', error);
      toast.error('Failed to verify vehicle: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  const getStatusIndicator = () => {
    if (user === null) return null;
    return (
      <div className="d-flex align-items-center" style={{ marginLeft: '70%' }}>
        <span className="status-text" style={{ marginRight: '10%', marginBottom: '3%' }}>
          {user.status ? 'Active' : 'Inactive'}
        </span>
        <div 
          className="status-indicator" style={{ backgroundColor: user.status ? 'green' : 'grey', marginLeft: '20%' }}
        />
      </div>
    );
  };

  const handleStartNavigation = () => {
    if (directionsResponse && directionsResponse.length === 2) {
      const startLat = directionsResponse[0].routes[0].legs[0].start_location.lat();
      const startLng = directionsResponse[0].routes[0].legs[0].start_location.lng();
      const patientLat = directionsResponse[0].routes[0].legs[0].end_location.lat(); // Point B
      const patientLong = directionsResponse[0].routes[0].legs[0].end_location.lng(); // Point B
      const destLat = directionsResponse[1].routes[0].legs[0].end_location.lat(); // Point C
      const destLng = directionsResponse[1].routes[0].legs[0].end_location.lng();
  
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}&waypoints=${patientLat},${patientLong}&travelmode=driving`;
      window.open(googleMapsUrl, '_blank');
    } else {
      toast.error("No directions available");
    }
  };
  
  return (
    <>
    <div>
    <MDBContainer>
      <MDBRow>
      {showAvailabilityButtons && (
      <div style={{ position: 'fixed', top: '4%', left: '2%',zIndex: 100 }}>
                <button
                  onClick={() => AvailabilityToggle('Available')}
                  style={{
                    backgroundColor: availabilityStatus === 'Available' ? 'green' : 'grey',
                    color: 'white', padding: '10px 20px', marginRight: '10px', borderRadius: '5px',
                    border: 'none', cursor: 'pointer', fontSize: '16px',
                  }}
                >
                  Available
                </button>
                <button
                  onClick={() => AvailabilityToggle('Unavailable')}
                  style={{
                    backgroundColor: availabilityStatus === 'Unavailable' ? 'red' : 'grey',
                    color: 'white', padding: '10px 20px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '16px',
                  }}
                >
                  Unavailable
                </button>
              </div> )}
        {showProfileCard ? (
          <MDBCol md="3" style={{ marginTop: '50px' }} className="profile-card">
            <MDBCard className="h-100 mt-5 profile-card-body">
              <MDBCardBody>
                <MDBCardTitle>{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</MDBCardTitle>
                <div className="profile-img-container">
                  <img
                    src={profileImage ? `http://localhost:8888${profileImage}` : "https://via.placeholder.com/150"}
                    alt="Profile" className="profile-img"
                  />
                </div>
                {getStatusIndicator()}
                <MDBListGroup flush>
                  {['Notification - Accept Rides','Upcoming Rides', 'Profile Picture', 'History','Update Profile', 'Verify Vehicle', 'Sign out'].map((module) => (
                    <MDBListGroupItem
                      key={module}
                      action
                      onClick={() => {
                        if (module === 'Sign out') {
                          handleSignOut(); 
                        } else if (module === 'Notification - Accept Rides') {
                          acceptPendingRides(); setSelectedModule(module); setShowProfileCard(false); setShowAvailabilityButtons(false);
                        } else if (module === 'Upcoming Rides') {
                          fetchUpcomingRides(); setSelectedModule(module); setShowProfileCard(false); setShowAvailabilityButtons(false);
                        } else if (module === 'Verify Vehicle') {
                          setVerifyVehicle(true); setSelectedModule(module); setShowProfileCard(false); setShowAvailabilityButtons(false);
                        } else {
                          setSelectedModule(module); setShowProfileCard(false); setShowAvailabilityButtons(false);
                        }
                      }}
                      active={selectedModule === module}
                    >
                      {module}
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ) : (
          <>
            {selectedModule === 'Profile Picture' && (
              <MDBCol md="8" className="profile-picture-card">
                <MDBCard className="h-100 mt-4 profile-picture-body">
                  <MDBCardBody>
                    <MDBCardTitle>
                      Profile Picture
                    </MDBCardTitle>
                    <div className="form-group mb-3">
                      <label className="file-label">Choose a Profile Picture</label>
                      <input type="file" className="form-control" onChange={handleImageChange} />
                    </div>
                    <MDBBtn color="dark" className="upload-btn" onClick={handleImageUpload}>Upload Picture</MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            )}

            {selectedModule === 'Notification - Accept Rides' && (
              <MDBCol md="8" className="upcoming-rides-card">
                <MDBCard className="h-100 mt-4 upcoming-rides-body">
                  <MDBCardBody>
                    <MDBCardTitle>
                      Accept Rides
                    </MDBCardTitle>
                    <MDBTable striped>
                      <MDBTableHead>
                        <tr>
                          <th>Date</th> <th>Time</th> <th>Action</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {locations.map((location) => (
                          <tr key={location._id}>
                            <td>{new Date(location.date).toISOString().split('T')[0]}</td>
                            <td>{location.time}</td>
                            <td>
                              <MDBBtn size="sm" color="success" onClick={() => handleAcceptClick(location)}>Accept</MDBBtn>
                              <MDBBtn style={{marginLeft: '10%'}} size="sm" color="danger" onClick={() => handleStartClick(location)}>Decline</MDBBtn>
                              </td>
                          </tr>
                        ))}
                      </MDBTableBody>
                    </MDBTable>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            )}

            {selectedModule === 'Upcoming Rides' && (
              <MDBCol md="8" className="upcoming-rides-card">
                <MDBCard className="h-100 mt-4 upcoming-rides-body">
                  <MDBCardBody>
                    <MDBCardTitle>
                      Upcoming Rides
                    </MDBCardTitle>
                    <MDBTable striped>
                      <MDBTableHead>
                        <tr>
                          <th>Date</th> <th>Time</th> <th>Action</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        {locations.map((location) => (
                          <tr key={location._id}>
                            <td>{new Date(location.date).toISOString().split('T')[0]}</td>
                            <td>{location.time}</td>
                            <td><MDBBtn size="sm" color="success" onClick={() => handleStartClick(location)}>Start</MDBBtn></td>
                          </tr>
                        ))}
                      </MDBTableBody>
                    </MDBTable>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            )}

            {selectedModule === 'Update Profile' && (
              <MDBCol md="8" className="update-profile-card">
                <MDBCard className="h-100 mt-4 update-profile-body">
                  <MDBCardBody>
                    <MDBCardTitle>
                      Update Profile
                    </MDBCardTitle>
                    <div className="text-center mt-5">
                      <form>
                        <div className="input-wrapper mb-4">
                          <label htmlFor="firstName" className="form-label">First Name</label>
                          <MDBInput
                            id="firstName" name="firstName" type="text" size="lg" className="flex-grow-1" value={editableUser.firstName} onChange={handleInputChange} required
                          />
                        </div>
                        <div className="input-wrapper mb-4">
                          <label htmlFor="lastName" className="form-label">Last Name</label>
                          <MDBInput
                            id="lastName" name="lastName" type="text" size="lg" className="flex-grow-1" value={editableUser.lastName} onChange={handleInputChange} required
                          />
                        </div>
                        <div className="input-wrapper mb-4">
                          <label htmlFor="emailId" className="form-label">Email Id</label>
                          <MDBInput
                            id="emailId" name="emailId" type="text" size="lg" className="flex-grow-1" value={editableUser.emailId} onChange={handleInputChange} required
                          />
                        </div>
                        <MDBBtn color="dark" className="update-btn" onClick={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                          Update Profile
                        </MDBBtn>
                      </form>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            )}

            {selectedModule === 'Verify Vehicle' && (
              <MDBCol md="8" className="verify-vehicle-card">
                <MDBCard className="h-100 mt-5 verify-vehicle-body">
                  <MDBCardBody>
                    <MDBCardTitle>
                      Verify Vehicle
                    </MDBCardTitle>
                    <div className="input-wrapper mb-4">
                      <label htmlFor="vehicleNumber" className="form-label">Vehicle Number</label>
                      <MDBInput
                        id="vehicleNumber" type="text" size="lg" value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                      />
                    </div>
                    <MDBBtn color="primary" className="verify-btn" onClick={handleVerifyVehicle}>Verify</MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            )}
          </>
        )}
      </MDBRow>
      {(selectedModule || !showProfileCard) && (
        <div className="back-button-container">
          <MDBBtn color="secondary" style={{marginTop: '20%'}} onClick={handleBackClick}>Back</MDBBtn>
        </div>
      )}
    </MDBContainer>
    </div>

    <MDBFooter bgColor="dark" className="text-white text-center text-lg-left fixed-bottom">
      <div className="text-center p-3">
        &copy; {new Date().getFullYear()} Voluntary Ambulance Services - VAS LiftAssist. All rights reserved.
        <a className="text-white" href="https://example.com/">License Info</a>
      </div>
    </MDBFooter>

    <Modal
      isOpen={modalOpen}
      onRequestClose={() => setModalOpen(false)}
      contentLabel="Directions Modal"
      className="directions-modal"
    >
      <button onClick={() => setModalOpen(false)} className="close-btn">&times;</button>
      <div className="modal-header">
        <h1 className="modal-title">TRAVEL ROUTE</h1>
        <button onClick={handleStartNavigation} className="start-navigation-btn">Start Navigation</button>
      </div>

      {isLoaded && directionsResponse && directionsResponse.length === 2 && (
        <>
          <GoogleMap
            mapContainerClassName="modal-map-container" center={center} zoom={12}
            options={{
              zoomControl: true, streetViewControl: true, mapTypeControl: false, fullscreenControl: false,
            }}
          >
            <DirectionsRenderer 
              directions={directionsResponse[0]} 
              options={{
                polylineOptions: { strokeColor: 'blue', strokeOpacity: 0.7, strokeWeight: 5,},
                suppressMarkers: true,
              }} 
            />
            <Marker position={directionsResponse[0].routes[0].legs[0].start_location} label="A" />
            <Marker position={directionsResponse[0].routes[0].legs[0].end_location} label="B" />
            <DirectionsRenderer 
              directions={directionsResponse[1]} 
              options={{
                polylineOptions: { strokeColor: 'green', strokeOpacity: 0.7, strokeWeight: 5,},
                suppressMarkers: true,
              }} 
            />
            <Marker position={directionsResponse[1].routes[0].legs[0].start_location} label="C" />
            <Marker position={directionsResponse[1].routes[0].legs[0].end_location} label="D" />
          </GoogleMap>
        </>
      )}
    </Modal>
  </>
  );
}
export default HomePage;
