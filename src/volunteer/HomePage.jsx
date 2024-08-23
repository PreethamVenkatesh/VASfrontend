import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBRow,
  MDBListGroup,
  MDBListGroupItem,
  MDBFooter,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from 'mdb-react-ui-kit';
import axios from 'axios';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer
} from "@react-google-maps/api";
import useGoogleMaps from './GoogleMaps'; // Import the custom hook
import Modal from 'react-modal'; // Import react-modal
import "./Style.css";

// Set the app element for accessibility
Modal.setAppElement('#root');

function HomePage() {
  const [selectedModule, setSelectedModule] = useState('Upcoming Rides');
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [center, setCenter] = useState({ lat: 51.6214, lng: -3.9436 }); // Default to Swansea
  const [mapLoaded, setMapLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [destination, setDestination] = useState(null);
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useGoogleMaps(); // Use the custom hook

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
      const directionsRequest = {
        origin: center,
        destination: {
          lat: location.latitude,
          lng: location.longitude
        },
        travelMode: window.google.maps.TravelMode.DRIVING
      };

      directionsService.route(directionsRequest, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          setDestination(location);
          setModalOpen(true);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  return (
    <>
      <div className="custom-bg">
        <MDBContainer fluid className="main-content mt-0">
          <MDBRow>
            <MDBCol md="3" style={{ marginLeft: "10%", color: "whitesmoke", marginTop: "4%", height: "68vh" }}>
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
                  <MDBListGroup flush>
                    {['Upcoming Rides', 'Profile', 'History', 'Current Location', 'Terms & Consent', 'FAQs', 'Sign out'].map((module) => (
                      <MDBListGroupItem
                        key={module}
                        action
                        onClick={() => {
                          if (module === 'Sign out') {
                            handleSignOut(); // Call sign-out function
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

            {selectedModule === 'Profile' && (
              <MDBCol md="8" style={{ marginLeft: "10%", marginTop: "5%", height: "35vh", width: "50%" }}>
                <MDBCard className="h-100 mt-4" style={{ backgroundColor: "#fffdd0" }}>
                  <MDBCardBody>
                    <MDBCardTitle>Profile</MDBCardTitle>
                    <div className="form-group mb-3">
                      <label>Choose a Profile Picture</label>
                      <input type="file" className="form-control" onChange={handleImageChange} />
                    </div>
                    <MDBBtn color="dark" onClick={handleImageUpload}>Upload Picture</MDBBtn>
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
          },
          content: {
            color: 'lightsteelblue',
            backgroundColor: '#fffdd0',
            borderRadius: '10px',
            padding: '20px',
          },
        }}
      >
        <h1 style={{color: 'green'}}>Directions to Destination</h1>
        <button onClick={() => setModalOpen(false)} style={{ float: 'right', background: 'transparent', border: 'none', fontSize: '1.5rem' }}>&times;</button>
        {isLoaded && directionsResponse && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "600px" }}
            center={center}
            zoom={12}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <DirectionsRenderer directions={directionsResponse} />
          </GoogleMap>
        )}
      </Modal>
    </>
  );
}

export default HomePage;
