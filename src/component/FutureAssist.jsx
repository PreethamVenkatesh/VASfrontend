import React, { useState } from 'react';
import axios from 'axios';

function FutureAssist() {
  const [fromLocation, setFromLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (fromLocation && destination && date && time) {
      try {
        // Send POST request to the backend
        const response = await axios.post('http://localhost:8888/api/futurelocation', {
          fromLocation,
          destination,
          date,
          time
        });

        // If the request is successful, display confirmation
        if (response.status === 201) {
          setConfirmationMessage(`Your lift has been scheduled from ${fromLocation} to ${destination} on ${date} at ${time}.`);
          setErrorMessage('');  // Clear error message
          console.log(response)
        }
      } catch (error) {
        setErrorMessage('Error booking the request. Please try again.');
        setConfirmationMessage('');
        console.error('Error:', error);
      }
    } else {
      setConfirmationMessage('');
      setErrorMessage('Please fill in all the fields.');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Schedule Future Assistance</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label htmlFor="from" style={labelStyle}>From:</label>
          <input
            type="text"
            id="from"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            placeholder="Enter your current location"
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="destination" style={labelStyle}>Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter the destination"
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="date" style={labelStyle}>Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="time" style={labelStyle}>Time:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>Confirm</button>
      </form>

      {confirmationMessage && (
        <p style={confirmationStyle}>{confirmationMessage}</p>
      )}

      {errorMessage && (
        <p style={errorStyle}>{errorMessage}</p>
      )}
    </div>
  );
}

// Styling objects
const containerStyle = {
  padding: '2rem',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  maxWidth: '400px',
  margin: '2rem auto',
};

const headerStyle = {
  color: 'blue',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const formGroupStyle = {
  marginBottom: '1rem',
  width: '100%',
};

const labelStyle = {
  display: 'block',
  textAlign: 'left',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '1rem',
};

const confirmationStyle = {
  marginTop: '1.5rem',
  color: 'green',
  fontWeight: 'bold',
};

const errorStyle = {
  marginTop: '1.5rem',
  color: 'red',
  fontWeight: 'bold',
};

export default FutureAssist;
