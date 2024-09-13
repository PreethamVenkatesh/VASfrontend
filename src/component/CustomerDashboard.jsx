import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PA from '../images/PastAssists.png';
import RA from '../images/Request Assistance.jpeg';
import AI from '../images/Assistance Inprogress.jpeg';
import FA from '../images/BookFutureAssists.jpeg';
import HelpImage from '../images/Help.jpeg';  
import FaqsImage from '../images/FAQs.jpeg';  
import AccountImage from '../images/UserAccount.jpeg' 
import { NavLink } from 'react-router-dom';

function CustomerDashboard() {
  return (
    <div style={{ backgroundColor: 'yellow', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <NavLink to={'/account'} style={{ textDecoration: 'none' }}>
          <img 
            src={AccountImage} 
            alt='Account' 
            style={{ cursor: 'pointer', width: '50px', height: '50px' }} 
          />
          <br />
          <span style={{ color: 'blue', fontWeight: 'bolder', fontSize: '18px'}}>Account</span>
        </NavLink>
      </div>

      <div 
        style={{ 
          fontSize: '40px', 
          color: 'rgb(1, 1, 254)', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          textDecoration: 'underline',
          fontFamily: 'Times New Roman, serif',
          marginBottom: '20px',
        }}
      >
        Dashboard
      </div>

      <div>
        <Row
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
            textAlign: 'center',
          }}
        >
          <Col  
            xs={12} sm={6} md={3}
            style={{
              fontWeight: 'bolder',
              fontSize: '25px',
              marginBottom: '20px'
            }}
          >
            <NavLink to={'/pastAssist'} style={{ textDecoration: 'none' }}>
              <img 
                src={PA} 
                alt='' 
                style={{ 
                  cursor: 'pointer', 
                  width: '100%', 
                  maxWidth: '35%', 
                  height: '15vh', 
                  marginBottom: '8px' 
                }} 
              />
              <br />
              <span style={{ color: 'blue' }}>Past Assist</span>
            </NavLink>
          </Col>

          <Col  
            xs={12} sm={4} md={6}
            style={{
              fontWeight: 'bolder',
              fontSize: '25px',
              marginBottom: '20px'
            }}
          >
            <NavLink to={'/requestAssist'} style={{ textDecoration: 'none' }}>
              <img 
                src={RA} 
                alt='' 
                style={{ 
                  cursor: 'pointer', 
                  width: '100%', 
                  maxWidth: '35%', 
                  height: '13vh', 
                  marginBottom: '8px' 
                }} 
              />
              <br />
              <span style={{ color: 'blue' }}>Request Assistance</span>
            </NavLink>
            <br />
            <div style={{ margin: '30px 0' }} />
            <NavLink to={'/currentAssist'} style={{ textDecoration: 'none' }}>
              <img 
                src={AI} 
                alt='' 
                style={{ 
                  cursor: 'pointer', 
                  width: '100%', 
                  maxWidth: '35%', 
                  height: '14vh', 
                  marginBottom: '8px' 
                }} 
              />
              <br />
              <span style={{ color: 'blue' }}>Current Assistance</span>
            </NavLink>
          </Col>

          <Col  
            xs={12} sm={6} md={3}
            style={{
              fontWeight: 'bolder',
              fontSize: '25px',
              marginBottom: '20px'
            }}
          >
            <NavLink to={'/futureAssist'} style={{ textDecoration: 'none' }}>
              <img 
                src={FA} 
                alt='' 
                style={{ 
                  cursor: 'pointer', 
                  width: '100%', 
                  maxWidth: '40%', 
                  height: '10vh', 
                  marginBottom: '8px' 
                }} 
              />
              <br />
              <span style={{ color: 'blue' }}>Book Future Assistance</span>
            </NavLink>
          </Col>
        </Row>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
            textAlign: 'center'
          }}
        >
          <Col xs={6} sm={4}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <NavLink to={'/help'} style={{ textDecoration: 'none' }}>
                <img
                  src={HelpImage}
                  alt='Help'
                  style={{ width: '100%', maxWidth: '60%', height: '8vh', marginBottom: '8px' }}
                />
                <span style={{ color: 'blue', fontWeight: 'bolder', fontSize: '20px'}}>Help</span>
              </NavLink>
            </div>
          </Col>
          <Col xs={5} sm={2}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <NavLink to={'/faqs'} style={{ textDecoration: 'none' }}>
                <img
                  src={FaqsImage}
                  alt='FAQs'
                  style={{ width: '100%', maxWidth: '60%', height: '8vh', marginBottom: '8px' }}
                />
                <span style={{ color: 'blue', fontWeight: 'bolder', fontSize: '20px'}}>FAQs</span>
              </NavLink>
            </div>
          </Col> 
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
