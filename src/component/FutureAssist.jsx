// Importing necessary libraries and modules
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

function FutureAssist() {
  // State variables to manage form input and messages
  const [fromLocation, setFromLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [futureBookings, setFutureBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Get the current time in HH:MM format
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const minTime = `${hours}:${minutes}`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the booking time based on the selected date
    const selectedDate = new Date(date);
    const isToday = selectedDate.toISOString().split('T')[0] === today;
    
    if (isToday && time < minTime) {
      // Check if time is before the current time on the same day
      setErrorMessage('Time must be after the current time for today\'s bookings.');
      return;
    }

    // Check if all required fields are filled
    if (fromLocation && destination && date && time) {
      try {
        // Send a POST request to book future assistance
        const response = await axios.post('http://localhost:8888/api/futurelocation', {
          fromLocation,
          destination,
          date,
          time
        });

         // Handle successful booking
        if (response.status === 201) {
          setConfirmationMessage(`Your lift has been scheduled from ${fromLocation} to ${destination} on ${date} at ${time}.`);
          setErrorMessage(''); 
          console.log(response);
        }
      } catch (error) {
        // Handle errors during the booking process
        setErrorMessage('Error booking the request. Please try again.');
        setConfirmationMessage('');
        console.error('Error:', error);
      }
    } else {
      // Handle case where fields are not filled
      setConfirmationMessage('');
      setErrorMessage('Please fill in all the fields.');
    }
  };

  // Handle viewing future bookings
  const handleViewBookings = async () => {
    try {
      // Send a GET request to fetch future bookings
      const response = await axios.get('http://localhost:8888/api/futurebookings');
      setFutureBookings(response.data);  // Set bookings data from response
      setShowBookings(true); // Show bookings
    } catch (error) {
      console.error('Error fetching future bookings:', error);
      setErrorMessage('No Future Bookings done');
    }
  };

  // Handle closing the bookings display
  const handleCloseBookings = () => {
    setShowBookings(false);
  };

  return (
    <div style={pageContainerStyle}> 
      <div style={containerStyle}>
        {/* Back button to navigate to the customer page */}
        <div
          style={{position: 'absolute', left: '40px', top: '80px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
          onClick={() => navigate('/customerPage')}> 
          <FaArrowLeft size={30} color="blue" />
        </div>
        {/* Header for booking section */}
        <h2 style={headerStyle}>Book Future Assistance</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label htmlFor="from" style={labelStyle}>From:</label>
            <input
              type="text"
              id="from"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)} // Update state on input change
              placeholder="Enter your current location"
              style={inputStyle}
            />
          </div>

           {/* Destination Input */}
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

          {/* Date Input */}
          <div style={formGroupStyle}>
            <label htmlFor="date" style={labelStyle}>Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)} // Update state on input change
              min={today} // Set minimum date to today
              style={inputStyle}
            />
          </div>

          {/* Time Input */}
          <div style={formGroupStyle}>
            <label htmlFor="time" style={labelStyle}>Time:</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)} // Update state on input change
              min={date === today ? minTime : "00:00"} // Set minimum time to current time if today
              style={inputStyle}
            />
          </div>

          {/* Submit button */}
          <button type="submit" style={buttonStyle}>Confirm</button>
        </form>

        {/* Confirmation message display */}
        {confirmationMessage && (
          <p style={confirmationStyle}>{confirmationMessage}</p>
        )}

        {/* Error message display */}
        {errorMessage && (
          <p style={errorStyle}>{errorMessage}</p>
        )}

        {/* Button to view future bookings */}
        <button onClick={handleViewBookings} style={buttonStyle}>View Future Bookings</button>

        {/* Display future bookings if available */}
        {showBookings && (
          <div style={bookingsContainerStyle}>
            <h3>Future Bookings:</h3>
            <ul>
              {futureBookings.map((booking, index) => (
                <li key={index}>
                  {/* Display each booking */}
                  {booking.fromLocation} to {booking.destination} on {new Date(booking.date).toLocaleDateString()} at {booking.time}
                </li>
              ))}
            </ul>
            <button onClick={handleCloseBookings} style={closeButtonStyle}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles for the component
const pageContainerStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'yellow',
  padding: '2rem',
};

const containerStyle = {
  padding: '2rem',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
  backgroundColor: 'yellow', 
  backgroundSize: 'cover',
  borderRadius: '8px',
  maxWidth: '400px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  color: 'blue',
  fontWeight: 'bold',
  textDecoration: 'underline',
  fontSize: '40px',
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

const bookingsContainerStyle = {
  marginTop: '1.5rem',
  padding: '1rem',
  backgroundColor: 'lightblue',
  borderRadius: '4px',
  textAlign: 'left',
};

const closeButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '1rem',
};

export default FutureAssist; // Exporting the FutureAssist component