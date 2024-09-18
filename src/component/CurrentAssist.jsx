import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function CurrentAssist() {
  const [bookingConfirmation, setBookingConfirmation] = useState('Yes');
  const [volunteerName, setVolunteerName] = useState('John Doe');
  const [vehicleNumber, setVehicleNumber] = useState('ABC1234');
  const [arrivalTime, setArrivalTime] = useState('14:30');
  const [ratings, setRatings] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ratings) {
      try {
        const response = await axios.post('http://localhost:8888/api/currentassist', {
          bookingConfirmation,
          volunteerName,
          vehicleNumber,
          arrivalTime,
          ratings,
          feedback
        });

        if (response.status === 201) {
          setConfirmationMessage('Your details have been successfully submitted.');
          setErrorMessage('');  
        }
      } catch (error) {
        setErrorMessage('Error submitting the details. Please try again.');
        setConfirmationMessage('');
        console.error('Error:', error);
      }
    } else {
      setConfirmationMessage('');
      setErrorMessage('Please fill in all required fields.');
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
      <div
        style={{position: 'absolute',left: '60px',top: '40px',cursor: 'pointer',display: 'flex',alignItems: 'center'}}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>
        <h2 style={headerStyle}>Current Assistance</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Booking Confirmation:</label>
            <div style={radioGroupStyle}>
              <label>
                <input
                  type="radio"
                  name="bookingConfirmation"
                  value="Yes"
                  checked={bookingConfirmation === 'Yes'}
                  onChange={(e) => setBookingConfirmation(e.target.value)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="bookingConfirmation"
                  value="No"
                  checked={bookingConfirmation === 'No'}
                  onChange={(e) => setBookingConfirmation(e.target.value)}
                />
                No
              </label>
            </div>
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="volunteerName" style={labelStyle}>Volunteer Allocated Name:</label>
            <input
              type="text"
              id="volunteerName"
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              placeholder="Enter volunteer name"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="vehicleNumber" style={labelStyle}>Volunteer Vehicle Number:</label>
            <input
              type="text"
              id="vehicleNumber"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="Enter vehicle number"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="arrivalTime" style={labelStyle}>Arrival Time:</label>
            <input
              type="time"
              id="arrivalTime"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="ratings" style={labelStyle}>Post Completion Ratings:</label>
            <input
              type="number"
              id="ratings"
              value={ratings}
              onChange={(e) => setRatings(e.target.value)}
              placeholder="Enter ratings (1-5)"
              min="1"
              max="5"
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="feedback" style={labelStyle}>Feedback:</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback"
              rows="4"
              style={{ ...inputStyle, resize: 'vertical' }} 
            />
          </div>

          <button type="submit" style={buttonStyle}>Submit</button>
        </form>

        {confirmationMessage && (
          <p style={confirmationStyle}>{confirmationMessage}</p>
        )}

        {errorMessage && (
          <p style={errorStyle}>{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',      
  alignItems: 'center',          
  height: '100vh',   
  fontFamily: 'Arial, sans-serif',
  backgroundColor: 'yellow',
  backgroundSize: 'cover',       
};

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'yellow',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  width: '100%',
  maxWidth: '600px',
};

const headerStyle = {
  color: 'blue',
  fontWeight: 'bold',
  marginBottom: '1.5rem',
  textDecoration: 'underline',
  fontSize: '40px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
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

const radioGroupStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
};

export default CurrentAssist;
