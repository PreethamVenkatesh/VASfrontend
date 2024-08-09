import React, { useState, useEffect } from 'react';
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
import "./Style.css";

function HomePage() {
  const [selectedModule, setSelectedModule] = useState('Profile');
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login page if no token
          return;
        }

        const response = await axios.get('http://localhost:8888/api/user', {
          headers: {
            'Authorization': token
          }
        });
        
        // Ensure the relative path is used
        const relativePath = response.data.profilePicture;
        setUser(response.data);
        setProfileImage(relativePath);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
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

      // Ensure the relative path is used
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
            <MDBCol md="3" style={{ marginLeft: "10%", color: "whitesmoke", marginTop: "4%" }}>
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
                    {['Profile', 'Dashboard', 'History', 'Availability', 'Terms & Consent', 'FAQs', 'Sign out'].map((module) => (
                      <MDBListGroupItem
                        key={module}
                        action
                        onClick={() => setSelectedModule(module)}
                        active={selectedModule === module}
                      >
                        {module}
                      </MDBListGroupItem>
                    ))}
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
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
