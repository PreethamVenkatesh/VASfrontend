import React, { useState } from 'react';

function PastAssist() {
  // Dummy data stored in useState
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

  // Function to handle rebooking action
  const handleRebook = (index) => {
    alert(`Rebooking assistance for ${pastAssists[index].destination}`);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: 'blue', marginBottom: '1.5rem' }}>Past Assistance</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    padding: '0.5rem 1rem', 
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

// Styling for table headers and cells
const tableHeaderStyle = {
  padding: '1rem',
  border: '1px solid #ddd',
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: '#333',  // Background for header row
  color: 'white',           // White text for header
};

const tableCellStyle = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  color: 'white',           // White text for table cells
  backgroundColor: '#444',  // Dark background for table cells
};

export default PastAssist;
