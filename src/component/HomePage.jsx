// src/components/HomePage.js
import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCol,
  MDBRow,
  MDBListGroup,
  MDBListGroupItem,
  MDBNavbar,
  MDBNavbarBrand,
  MDBFooter
} from 'mdb-react-ui-kit';

function HomePage() {
  const [selectedModule, setSelectedModule] = useState('Profile');

  const renderContent = () => {
    switch (selectedModule) {
      case 'Profile':
        return <div>Profile content with an option to upload a picture.</div>;
      case 'Account':
        return <div>Account module content.</div>;
      case 'Dashboard':
        return <div>Dashboard module content.</div>;
      case 'History':
        return <div>History module content.</div>;
      case 'Availability':
        return <div>Availability module content.</div>;
      case 'Terms & Consent':
        return <div>Terms & Consent module content.</div>;
      case 'FAQs':
        return <div>FAQs module content.</div>;
      case 'Sign out':
        return <div>Sign out module content.</div>;
      default:
        return <div>Select a module to view its content.</div>;
    }
  };

  return (
    <>
      <MDBNavbar dark bgColor="dark" fixed="top">
        <MDBContainer>
          <MDBNavbarBrand href="/">
            Voluntary Ambulance Services - VAS LiftAssist
          </MDBNavbarBrand>
        </MDBContainer>
      </MDBNavbar>
      <div className="custom-bg">
        <MDBContainer fluid className="main-content">
          <MDBRow>
            <MDBCol md="3">
              <MDBCard className="h-100">
                <MDBCardBody>
                  <MDBCardTitle>Profile Name</MDBCardTitle>
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Profile"
                    className="img-fluid rounded-circle mb-3"
                  />
                  <MDBListGroup flush>
                    {['Profile', 'Account', 'Dashboard', 'History', 'Availability', 'Terms & Consent', 'FAQs', 'Sign out'].map((module) => (
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
            <MDBCol md="9">
              <MDBCard className="h-100">
                <MDBCardBody>
                  <MDBCardTitle>{selectedModule}</MDBCardTitle>
                  <MDBCardText>{renderContent()}</MDBCardText>
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
