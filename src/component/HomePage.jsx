import React from 'react';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText } from 'mdb-react-ui-kit';

function HomePage() {
  return (
    <MDBContainer className="my-5">
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle>Welcome to VAS Lift Assist</MDBCardTitle>
          <MDBCardText>
            You have successfully logged in as a volunteer.
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default HomePage;