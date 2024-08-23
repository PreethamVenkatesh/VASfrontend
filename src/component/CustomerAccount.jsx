import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ProfImg from '../images/BlankProfilePic.webp'
import { Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CustomerAccount() {
  const [userData, setUserData] = useState();
  const token = localStorage.getItem('token')
  const fetchUserDetails = () => {

    if(token) {
      const decoded = jwtDecode(token)
      const decodedEmail = decoded.emailId
      axios.get(`http://localhost:8888/api/custdetails?emailId=${decodedEmail}`)
      .then((res) => {
        setUserData (res.data)
      })
      .catch((err) => {
        console.log(err)
      })
    } else {
      console.log("")
    }
  }
  useEffect(()=>{
    fetchUserDetails()
  },[token])
  console.log(userData)
  return (
    <div>
      <Row>
        <Col style={{marginLeft:"10%", marginTop: '2%'}} >
          <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src= {ProfImg} />
            <Card.Body>
              <Card.Title><b>PROFILE INFO</b></Card.Title>
            </Card.Body>
          { userData && 
            <ListGroup className="list-group-flush">
              <ListGroup.Item><b>First Name </b> <br /> {userData.firstName}</ListGroup.Item>
              <ListGroup.Item><b>Last Name </b> <br /> {userData.lastName}</ListGroup.Item>
              <ListGroup.Item><b>Email </b> <br />{userData.emailId}</ListGroup.Item>
              <ListGroup.Item><b>Phone Number </b> <br />{userData.phoneNumber}</ListGroup.Item>
            </ListGroup>
              }
            <Card.Body>
            <Button>
              Update
            </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    <Row>
        <Col>1 of 3</Col>
      </Row>
    </div>
  )
}

export default CustomerAccount