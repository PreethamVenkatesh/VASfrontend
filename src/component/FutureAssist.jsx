import React, { useState, useRef } from 'react';
import axios from 'axios';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const libraries = ['places'];

const FutureAssist = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [fromLatLng, setFromLatLng] = useState({ lat: null, lng: null });
  const [destination, setDestination] = useState('');
  const [destinationLatLng, setDestinationLatLng] = useState({ lat: null, lng: null });
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [futureBookings, setFutureBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const fromSearchBoxRef = useRef(null);
  const destinationSearchBoxRef = useRef(null);
  const navigate = useNavigate();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Get the current time in HH:MM format
  const currentTime = new Date();
  const hours = currentTime.getHours().toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const minTime = `${hours}:${minutes}`;

  const handleFromPlaceChanged = () => {
    const places = fromSearchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setFromLocation(place.formatted_address || place.name);
      const { lat, lng } = place.geometry.location;
      setFromLatLng({ lat: lat(), lng: lng() });
    }
  };

  const handleDestinationPlaceChanged = () => {
    const places = destinationSearchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setDestination(place.formatted_address || place.name);
      const { lat, lng } = place.geometry.location;
      setDestinationLatLng({ lat: lat(), lng: lng() });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      fromLatLng.lat &&
      fromLatLng.lng &&
      destinationLatLng.lat &&
      destinationLatLng.lng &&
      date &&
      time
    ) {
      try {
        const response = await axios.post('http://localhost:8888/api/futurelocation', {
          fromLocation,
          destination,
          date,
          time,
          fromLat: fromLatLng.lat,
          fromLng: fromLatLng.lng,
          destLat: destinationLatLng.lat,
          destLng: destinationLatLng.lng,
        });

        if (response.status === 201) {
          setConfirmationMessage(`Your lift has been scheduled from ${fromLocation} to ${destination} on ${date} at ${time}.`);
          setErrorMessage('');
        }
      } catch (error) {
        setErrorMessage('Error booking the request. Please try again.');
        setConfirmationMessage('');
        console.error('Error:', error);
      }
    } else {
      setConfirmationMessage('');
      setErrorMessage('Please fill in all fields correctly.');
    }
  };

  const handleViewBookings = async () => {
    try {
      const response = await axios.get('http://localhost:8888/api/futurebookings');
      setFutureBookings(response.data);
      setShowBookings(true);
    } catch (error) {
      console.error('Error fetching future bookings:', error);
      setErrorMessage('Error fetching future bookings');
    }
  };

  const handleCloseBookings = () => {
    setShowBookings(false);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAyy8CB38wO_EDwAG8bO_WuKrO46JrvKt0" libraries={libraries}>
      <div style={pageContainerStyle}>
        <div style={containerStyle}>
          <div
            style={{ position: 'absolute', left: '40px', top: '80px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/customerPage')}
          >
            <FaArrowLeft size={30} color="blue" />
          </div>
          <h2 style={headerStyle}>Book Future Assistance</h2>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={formGroupStyle}>
              <label htmlFor="from" style={labelStyle}>From:</label>
              <StandaloneSearchBox
                onLoad={ref => (fromSearchBoxRef.current = ref)}
                onPlacesChanged={handleFromPlaceChanged}
              >
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="Enter your current location"
                  style={inputStyle}
                />
              </StandaloneSearchBox>
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="destination" style={labelStyle}>Destination:</label>
              <StandaloneSearchBox
                onLoad={ref => (destinationSearchBoxRef.current = ref)}
                onPlacesChanged={handleDestinationPlaceChanged}
              >
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter the destination"
                  style={inputStyle}
                />
              </StandaloneSearchBox>
            </div>

            <div style={formGroupStyle}>
              <label htmlFor="date" style={labelStyle}>Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today} // Set minimum date to today
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
                min={date === today ? minTime : '00:00'} // Set minimum time based on the date selected
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

          <button onClick={handleViewBookings} style={buttonStyle}>View Future Bookings</button>

          {showBookings && (
            <div style={bookingsContainerStyle}>
              <h3>Future Bookings:</h3>
              <ul>
                {futureBookings.map((booking, index) => (
                  <li key={index}>
                    {booking.fromLocation} to {booking.destination} on {new Date(booking.date).toLocaleDateString()} at {booking.time}
                  </li>
                ))}
              </ul>
              <button onClick={handleCloseBookings} style={closeButtonStyle}>Close</button>
            </div>
          )}
        </div>
      </div>
    </LoadScript>
  );
}

// Styles (same as before)
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
  borderRadius: '8px',
  maxWidth: '600px',
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
  padding: '0.5rem 1rem',
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const confirmationStyle = {
  color: 'green',
  fontWeight: 'bold',
  marginTop: '1rem',
};

const errorStyle = {
  color: 'red',
  marginTop: '1rem',
};

const bookingsContainerStyle = {
  marginTop: '1rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
};

const closeButtonStyle = {
  marginTop: '1rem',
  padding: '0.5rem 1rem',
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default FutureAssist;