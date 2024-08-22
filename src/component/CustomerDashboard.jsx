import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PA from '../images/PastAssists.png';
import RA from '../images/Request Assistance.jpeg';
import AI from '../images/Assistance Inprogress.jpeg';
import FA from '../images/BookFutureAssists.jpeg';
import HelpImage from '../images/Help.jpeg';  
import FaqsImage from '../images/FAQs.jpeg';   
import { NavLink } from 'react-router-dom';
import './CD.css';

function CustomerDashboard() {
  return (
    <div className='abc'>
      <div style={{ 
            fontSize: '40px', 
            color: 'rgb(1, 1, 254)', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            textDecoration: 'underline',
            fontFamily: 'Times New Roman, serif' }}>
        Customer Dashboard
      </div>
      <div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
          }}
        >
          <Col
            style={{
              fontWeight: 'bolder',
              fontSize: '25px'
            }}
          >
            <NavLink to={'/pastAssist'} style={{ textDecoration: 'none' }}>
              <img src={PA} alt='' style={{ cursor: 'pointer' }} />
              <br />
              <span style={{ color: 'yellow' }}>Past Assist</span>
            </NavLink>
          </Col>
          <Col
            style={{
              color: 'red',
              fontWeight: 'bolder',
              fontSize: '25px',
              cursor: 'pointer'
            }}
          >
            <img src={RA} alt='' style={{ cursor: 'pointer' }} />
            <br />
            <span>Request Assistance</span>
            <br />
            <div style={{ margin: '60px 0' }} />
            <img src={AI} alt='' style={{ cursor: 'pointer' }} />
            <br />
            <span>Current Assistance</span>
          </Col>
          <Col
            style={{
              color: 'yellow',
              fontWeight: 'bolder',
              fontSize: '25px',
              cursor: 'pointer'
            }}
          >
            <img src={FA} alt='' style={{ cursor: 'pointer' }} />
            <br />
            <span>Book Future Assistance</span>
            {/* <Button variant="danger" style={{fontSize:"50px"}} > Book Future Assistance</Button> */}
          </Col>
        </Row>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '20%',
            marginLeft: '40%'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={HelpImage}
              alt='Help'
              style={{ width: '120px', height: '90px', marginBottom: '8px' }}
            />
            <span style={{ color: 'yellow', fontWeight: 'bolder' }}>Help</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={FaqsImage}
              alt='FAQs'
              style={{ width: '120px', height: '90px', marginBottom: '8px' }}
            />
            <span style={{ color: 'yellow', fontWeight: 'bolder' }}>FAQs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;

// {/* <Button variant="danger" style={{fontSize:"50px"}} > Request Assistance</Button> <br/> */}
//the above line for button
