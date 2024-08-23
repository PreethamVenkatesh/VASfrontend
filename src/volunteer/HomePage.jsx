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
  MDBBtn
} from 'mdb-react-ui-kit';
import axios from 'axios';
import {
  useJsApiLoader,
  GoogleMap,
  Marker
} from "@react-google-maps/api";
import "./Style.css";

function HomePage() {
  const [selectedModule, setSelectedModule] = useState('Upcoming Rides');
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [center, setCenter] = useState({ lat: 51.6214, lng: -3.9436 }); // Default to Swansea
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyAyy8CB38wO_EDwAG8bO_WuKrO46JrvKt0",  // Replace with your actual API key
  });

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
    </>
  );
}

export default HomePage;
