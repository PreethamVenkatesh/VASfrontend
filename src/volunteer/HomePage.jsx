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
  const [selectedModule, setSelectedModule] = useState('Upcoming Rides');
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [center, setCenter] = useState({ lat: 51.6214, lng: -3.9436 }); // Default to Swansea
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [setDestination] = useState(null);
  const [locations, setLocations] = useState([]);
  const [verifyVehicle, setVerifyVehicle] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const navigate = useNavigate();
  const [editableUser, setEditableUser] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
  });

  const { isLoaded } = useGoogleMaps(); // Use the custom hook

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

        const locationsResponse = await axios.get(`http://localhost:8888/locations/${response.data.firstName}`);
        setLocations(locationsResponse.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMapLoaded(true); 
        },
        (error) => {
          console.error("Error getting current location:", error);
          setMapLoaded(true); 
        }
      );
    } else {
      setMapLoaded(true); 
    }
  }, []);

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
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8888/api/user', {
        headers: {
          'Authorization': token
        }
      });
  
      const locationsResponse = await axios.get(`http://localhost:8888/locations/${response.data.firstName}`);
      setLocations(locationsResponse.data);
    } catch (error) {
      console.error('Error fetching upcoming rides:', error);
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
  
      // Request directions from the current location to the customer's location (A to B)
      const directionsRequestToCustomer = {
        origin: center,
        destination: {
          lat: location.custLocationLat,
          lng: location.custLocationLong
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      };
  
      // Request directions from the customer's location to the destination (B to C)
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
  
      // Fetch both directions simultaneously
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
  
      // Save the directions responses for rendering
      setDirectionsResponse([directionsToCustomer, directionsToDestination]);
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
  
  return (
    <>
      <div className="custom-bg">
        <MDBContainer fluid className="main-content mt-0">
          <MDBRow>
            <MDBCol md="3" style={{ marginLeft: "10%", color: "whitesmoke", marginTop: "4%", height: "7.5%" }}>
              <MDBCard className="h-100 mt-5" style={{ backgroundColor: "#fffdd0" }}>
                <MDBCardBody>
                  <MDBCardTitle>{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</MDBCardTitle>
                  <div className="profile-img-container mt-3 mb-3" style={{ marginLeft: "23%"}}>
                    <img
                      src={profileImage ? `http://localhost:8888${profileImage}` : "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="profile-img"
                    />
                  </div>
                  {getStatusIndicator()}
                  <MDBListGroup flush>
                    {['Upcoming Rides', 'Profile Picture', 'History', 'Current Location', 'Update Profile', 'Verify Vehicle', 'Sign out'].map((module) => (
                      <MDBListGroupItem
                        key={module}
                        action
                        onClick={() => {
                          if (module === 'Sign out') {
                            handleSignOut(); 
                          } else if (module === 'Upcoming Rides') {
                            fetchUpcomingRides(); 
                            setSelectedModule(module);
                          } else if (module === 'Verify Vehicle') {
                            setVerifyVehicle(true);
                            setSelectedModule(module);
                          } else {
                            setSelectedModule(module);
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

            {selectedModule === 'Profile Picture' && (
              <MDBCol md="8" style={{ marginLeft: "10%", marginTop: "5%", height: "35vh", width: "50%" }}>
                <MDBCard className="h-100 mt-4" style={{ backgroundColor: "#fffdd0" }}>
                  <MDBCardBody>
                    <MDBCardTitle>Profile Picture</MDBCardTitle>
                    <div className="form-group mb-3">
                      <label style={{marginBottom: "3%", marginTop: "2%"}}>Choose a Profile Picture</label>
                      <input type="file" className="form-control" onChange={handleImageChange} />
                    </div>
                    <MDBBtn color="dark" style={{marginTop: "2%"}} onClick={handleImageUpload}>Upload Picture</MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            )}

            {selectedModule === 'Upcoming Rides' && (
              <MDBCol md="8" style={{ marginLeft: "10%", marginTop: "5%", height: "35vh", width: "50%" }}>
                <MDBCard className="h-100 mt-4" style={{ backgroundColor: "#fffdd0" }}>
                
                  <MDBCardBody>
                    <MDBCardTitle>Upcoming Rides</MDBCardTitle>
                    <MDBTable striped>
                      <MDBTableHead>
                        <tr>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Action</th>
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
              <MDBCol md="8" style={{ marginLeft: "10%", marginTop: "5%", height: "75vh", width: "50%" }}>
                <MDBCard className="h-100 mt-4" style={{ backgroundColor: "#fffdd0" }}>
                <MDBCardBody>
                    <MDBCardTitle>Update Profile</MDBCardTitle>
                    <div className="text-center mt-5">
                      <form>
                        <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "80%", display: "flex", alignItems: "center" }}>
                          <label htmlFor="firstName" className="form-label" style={{ fontSize: "20px", fontWeight: "bold", marginRight: "2%" }}>
                            First Name
                          </label>
                          <MDBInput
                            id="firstName" name="firstName" type="text" size="lg" className="flex-grow-1" style={{marginLeft: '30%'}} value={editableUser.firstName} onChange={handleInputChange} required
                          />
                        </div>
                        <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "80%", display: "flex", alignItems: "center" }}>
                          <label htmlFor="lastName" className="form-label" style={{ fontSize: "20px", fontWeight: "bold", marginRight: "2%" }}>
                            Last Name
                          </label>
                          <MDBInput
                            id="lastName" name="lastName" type="text" size="lg" className="flex-grow-1" style={{marginLeft: '30%'}} value={editableUser.lastName} onChange={handleInputChange} required
                          />
                        </div>
                        <div className="input-wrapper mb-4" style={{ marginLeft: "10%", width: "80%", display: "flex", alignItems: "center" }}>
                          <label htmlFor="emailId" className="form-label" style={{ fontSize: "20px", fontWeight: "bold", marginRight: "2%" }}>
                            Email Id
                          </label>
                          <MDBInput
                            id="emailId" name="emailId" type="text" size="lg" className="flex-grow-1" style={{marginLeft: '40%'}} value={editableUser.emailId} onChange={handleInputChange} required
                          />
                        </div>
                        <MDBBtn color="dark" onClick={(e) => {e.preventDefault(); handleUpdateProfile();}} style={{ marginTop: "2%" }}>
                          Update Profile
                        </MDBBtn>
                      </form>
                    </div>
                  </MDBCardBody>

                </MDBCard>
              </MDBCol>
            )}  

            {selectedModule === 'Verify Vehicle' && (
                    <MDBCol md="8" style={{ marginLeft: "10%", marginTop: "5%", height: "80%", width: "40%" }}>
                      <MDBCard className="h-100 mt-5" style={{ backgroundColor: "#fffdd0", height: "100%" }}>
                        <MDBCardBody>
                          <MDBCardTitle style={{marginTop: '1%', marginBottom: '3%'}}>Verify Vehicle</MDBCardTitle>
                          <div className="d-flex align-items-center mb-3 mt-2">
                            <label htmlFor="vehicleNumber" style={{ marginRight: "5%", fontSize: "18px", fontWeight: "bold" }}>Vehicle Number</label>
                            <MDBInput
                              id="vehicleNumber"
                              type="text"
                              size="lg"
                              style={{ flex: 1 }}
                              value={vehicleNumber}
                              onChange={(e) => setVehicleNumber(e.target.value)}
                            />
                          </div>
                          <MDBBtn color="primary" style={{ marginTop: "2%" }} onClick={handleVerifyVehicle}>Verify</MDBBtn>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  )}


            {selectedModule === 'Current Location' && isLoaded && mapLoaded && (
              <MDBCol md="8" style={{ marginLeft: "4%", marginTop: "5%", height: "80vh", width: "60%" }}>
                <MDBCard className="h-100 mt-4" style={{ backgroundColor: "#fffdd0" }}>
                  <MDBCardBody>
                    <MDBCardTitle>Current Location</MDBCardTitle>
                    <GoogleMap
                      center={center}
                      zoom={12}
                      mapContainerStyle={{ width: "100%", height: "90%" }}
                      options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                      }}
                    >
                      <Marker
                        position={center}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                          scaledSize: new window.google.maps.Size(40, 40), // Adjust size of the marker
                        }}
                      />
                    </GoogleMap>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            )}
          </MDBRow>
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
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'lightsteelblue',
            backgroundColor: '#fffdd0',
            borderRadius: '10px',
            padding: '20px',
            width: '80%',
            height: '80%',
            zIndex: 1100,
          },
        }}
      >
        <button onClick={() => setModalOpen(false)} style={{ float: 'right', background: 'transparent', border: 'none', fontSize: '1.5rem' }}>&times;</button>
        <h1 style={{ color: 'green', marginLeft: '40%' }}>TRAVEL ROUTE</h1>
        
        {isLoaded && directionsResponse && directionsResponse.length === 2 && (
          <>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "88%", marginTop: '2%' }}
              center={center}
              zoom={12}
              options={{
                zoomControl: true,
                streetViewControl: true,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              {/* A to B: Blue route */}
              <DirectionsRenderer 
                directions={directionsResponse[0]} 
                options={{
                  polylineOptions: {
                    strokeColor: 'blue',
                    strokeOpacity: 0.7,
                    strokeWeight: 5,
                  },
                  suppressMarkers: true,
                }} 
              />

              <Marker 
                  position={directionsResponse[0].routes[0].legs[0].start_location} 
                  label="A" 
                />

                {/* Custom Marker for point B */}
                <Marker 
                  position={directionsResponse[0].routes[0].legs[0].end_location} 
                  label="B" 
                />

              {/* B to C: Green route */}
              <DirectionsRenderer 
                directions={directionsResponse[1]} 
                options={{
                  polylineOptions: {
                    strokeColor: 'green',
                    strokeOpacity: 0.7,
                    strokeWeight: 5,
                  },
                  suppressMarkers: true,
                }} 
              />

              <Marker 
                  position={directionsResponse[1].routes[0].legs[0].end_location} 
                  label="C" 
                />
            </GoogleMap>
          </>
        )}
      </Modal>
      <ToastContainer/>
    </>
  );
}

export default HomePage;