import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

function PastAssist() {
  const navigate = useNavigate();
  const [pastAssists, setPastAssists] = useState([]);
  const [volunteerNames, setVolunteerNames] = useState({}); // Store volunteer names with booking ID
  const [rebookMessage, setRebookMessage] = useState('');

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/completed-rides');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        // Sort the data in descending order by date and time
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Fetch volunteer names
        await fetchVolunteerNames(data);

        // Set the sorted past assists
        setPastAssists(data);
      } catch (error) {
        console.error('Error fetching completed rides:', error);
      }
    };

    fetchCompletedRides();
  }, []);

  const fetchVolunteerNames = async (data) => {
    const volunteerEmails = [...new Set(data.map(assist => assist.allocatedVolunteer))]; // Get unique emails

    try {
      const responses = await Promise.all(volunteerEmails.map(email => axios.get(`http://localhost:8888/api/verify-volunteer/${email}`)));
      const names = {};
      responses.forEach((response, index) => {
        if (response.data && response.data.firstName) {
          names[volunteerEmails[index]] = response.data.firstName; // Store name with email
        }
      });
      setVolunteerNames(names);
    } catch (error) {
      console.error('Error fetching volunteer names:', error);
    }
  };

  const handleRebook = (index) => {
    const destination = pastAssists[index].destination;
    setRebookMessage(`Rebooking completed.`);
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'yellow',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <div
        style={{
          position: 'absolute',
          left: '70px',
          top: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>
      <h2 style={{
        color: 'blue',
        marginBottom: '1.5rem',
        fontWeight: 'bolder',
        textDecoration: 'underline',
        fontSize: '42px', // Increased font size
      }}>
        Past <br />Assistance
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {pastAssists.map((assist, index) => (
          <div key={index} style={cardStyle}>
            <div style={cardContentStyle}>
              <h3 style={{ margin: '0 0 10px', fontSize: '22px', color: '#333' }}>{assist.destination}</h3>
              <p style={textStyle}>Date: {new Date(assist.date).toLocaleDateString()}</p>
              <p style={textStyle}>Time: {assist.time}</p>
              <p style={textStyle}>Volunteer Assisted: {volunteerNames[assist.allocatedVolunteer] || assist.allocatedVolunteer}</p>
              <p style={textStyle}>Email: {assist.allocatedVolunteer}</p>
              <p style={textStyle}>Rating: {assist.rating} / 5</p>
              <button 
                onClick={() => handleRebook(index)} 
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: '10px',
                  fontSize: '14px',
                }}>
                Rebook
              </button>
            </div>
          </div>
        ))}
      </div>

      {rebookMessage && <p style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>{rebookMessage}</p>}
    </div>
  );
}

const cardStyle = {
  backgroundColor: '#444',
  color: 'white',
  borderRadius: '8px',
  padding: '15px',
  margin: '10px',
  flex: '1 1 calc(45% - 20px)', // 2 cards per row with some margin
  boxSizing: 'border-box',
};

const cardContentStyle = {
  padding: '10px',
};

const textStyle = {
  margin: '5px 0',
  fontSize: '16px', // Increased font size for text
};

export default PastAssist;