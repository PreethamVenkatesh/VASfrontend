import React from 'react'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PA from '../images/Past Assists taken.png'
import RA from '../images/Request Assistance.jpeg'
import AI from '../images/Assistance Inprogress.jpeg'
import FA from '../images/Future Assistance.jpeg'
import { NavLink } from 'react-router-dom';
import './CD.css'

function CustomerDashboard() {
  return (
    <div className='abc' >CustomerDashboard
        <div>
            <Row style={{display:"flex",justifyContent:"center",alignItems:"center",height:"80vh"}} >
                <Col  
                style={{fontWeight:"bolder",fontSize:"25px" }}
                >
                    <NavLink to={'/pastAssist'} style={{textDecoration:"none"}} >

              <img src={PA} alt='' style={{cursor:"pointer"}}/>  <br/> <span style={{color:"white"}} >Past Assist</span> 
                    </NavLink>
                </Col>
                <Col
                style={{color:"red",fontWeight:"bolder",fontSize:"25px",cursor:"pointer"  }}
                >
                <img src={RA} alt='' style={{cursor:"pointer"}}/>  <br/> <span >Request Assistance</span><br/>
                <img src={AI} alt='' style={{cursor:"pointer"}}/>  <br/> <span >Assistance Inprogress</span>              
                </Col>
                <Col
                style={{color:"white",fontWeight:"bolder",fontSize:"25px",cursor:"pointer"  }}
                >
                <img src={FA} alt='' style={{cursor:"pointer"}}/>  <br/> <span >Book Future Assistance</span> 
                {/* <Button variant="danger" style={{fontSize:"50px"}} > Book Future Assistance</Button> */}
                
                </Col>
             </Row>
             <div style={{display:"flex",justifyContent:"space-between" ,width:"20%",marginLeft:"40%" }} >

        <Button variant="danger">Help</Button>
        <Button variant="danger">FAQs</Button>
             </div>
        </div>
    </div>
  )
}

export default CustomerDashboard

{/* <Button variant="danger" style={{fontSize:"50px"}} > Request Assistance</Button> <br/> */}
