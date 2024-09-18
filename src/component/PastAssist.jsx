import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function PastAssist() {
  const navigate = useNavigate();
  const [pastAssists, setPastAssists] = useState([
    {
      date: '2024-09-10',
      time: '14:30',
      destination: 'City Hospital',
      volunteerName: 'John Doe',
      ratings: 4.5,
    },
    {
      date: '2024-09-08',
      time: '11:00',
      destination: 'Green Valley Clinic',
      volunteerName: 'Jane Smith',
      ratings: 5,
    },
    {
      date: '2024-09-05',
      time: '09:45',
      destination: 'Sunrise Medical Center',
      volunteerName: 'Michael Johnson',
      ratings: 4,
    },
  ]);

  const handleRebook = (index) => {
    alert(`Rebooking assistance for ${pastAssists[index].destination}`);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: 'yellow', 
      minHeight: '100vh',
      padding: '20px' 
    }}>
      <div
        style={{position: 'absolute',left: '70px',top: '30px',cursor: 'pointer',display: 'flex',alignItems: 'center'}}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>
      <h2 style={{ color: 'blue', marginBottom: '1.5rem',fontWeight: 'bolder',textDecoration: 'underline',fontSize: '40px'}}>Past <br/>Assistance</h2>
      <table style={{ width: '100%'}}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={tableHeaderStyle}>Date</th>  
            <th style={tableHeaderStyle}>Time</th>
            <th style={tableHeaderStyle}>Destination</th>
            <th style={tableHeaderStyle}>Volunteer Name</th>
            <th style={tableHeaderStyle}>Ratings</th>
            <th style={tableHeaderStyle}>Rebook</th>
          </tr>
        </thead>
        <tbody>
          {pastAssists.map((assist, index) => (
            <tr key={index} style={{ textAlign: 'center' }}>
              <td style={tableCellStyle}>{assist.date}</td>
              <td style={tableCellStyle}>{assist.time}</td>
              <td style={tableCellStyle}>{assist.destination}</td>
              <td style={tableCellStyle}>{assist.volunteerName}</td>
              <td style={tableCellStyle}>{assist.ratings} / 5</td>
              <td style={tableCellStyle}>
                <button 
                  onClick={() => handleRebook(index)} 
                  style={{ 
                    backgroundColor: 'blue', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer' 
                  }}>
                  Rebook
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableHeaderStyle = {
  border: '1px solid #ddd',
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: '#333', 
  color: 'white', 
};

const tableCellStyle = {
  border: '1px solid #ddd',
  color: 'white',  
  backgroundColor: '#444', 
};

export default PastAssist;
