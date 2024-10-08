import React, { useState, useRef } from 'react';
import axios from 'axios';
import { StandaloneSearchBox } from '@react-google-maps/api'; // Using just the needed Google Maps API component
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // Fixing the import for jwtDecode
import useGoogleMaps from '../volunteer/GoogleMaps'; // Import the custom hook for Google Maps

const RequestAssist = () => {
  const { isLoaded, loadError } = useGoogleMaps(); // Using the custom hook for loading Google Maps API
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [fromLocation, setFromLocation] = useState('');
  const [fromLatLng, setFromLatLng] = useState({ lat: null, lng: null });
  const [destination, setDestination] = useState('');
  const [destinationLatLng, setDestinationLatLng] = useState({ lat: null, lng: null });
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const fromSearchBoxRef = useRef(null); 
  const destinationSearchBoxRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setFromLocation(`Lat: ${latitude}, Lng: ${longitude}`);
          setFromLatLng({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting the user's location", error);
        }
      );
    }
  };

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

  const handleBooking = async () => {
    if (!fromLatLng.lat || !fromLatLng.lng || !destinationLatLng.lat || !destinationLatLng.lng) {
      setBookingError('Please enter valid location coordinates.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.emailId;

      const response = await axios.post('http://localhost:8888/api/userlocation', {
        custLocationLat: fromLatLng.lat,
        custLocationLong: fromLatLng.lng,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        destinationLat: destinationLatLng.lat,
        destinationLong: destinationLatLng.lng,
        customerEmailId: decodedEmail
      });

      localStorage.setItem('driver', response.data.allocatedVolunteer);

      if (response.status === 201) {
        setIsBookingComplete(true);
        setBookingError('');
      }
    } catch (error) {
      console.error('Error booking the request:', error);
      setBookingError('No volunteers found nearby. Please try again.');
    }
  };

  // If there is an error loading the Google Maps API, display an error message
  if (loadError) {
    return <p>Error loading Google Maps: {loadError}</p>;
  }

  // Render a loading message while the API is being loaded
  if (!isLoaded) {
    return <p>Loading Google Maps...</p>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', textAlign: 'center', backgroundColor: 'yellow', minHeight: '100vh' }}>
      {/* Back button */}
      <div
        style={{position: 'absolute', left: '60px', top: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>

      {/* Title */}
      <h1 style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline', fontSize: '40px' }}>Request Assistance</h1>
      
      {/* Form for entering locations */}
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginTop: '8rem', justifyContent: 'center', width: '100%', maxWidth: '600px' }}>
          <label style={{ color: 'blue', fontWeight: 'bold', display: 'block' }}>From</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StandaloneSearchBox
              onLoad={ref => (fromSearchBoxRef.current = ref)}
              onPlacesChanged={handleFromPlaceChanged}
            >
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="Enter your location"
                style={{ width: '100%', padding: '0.5rem', marginRight: '0.5rem' }}
              />
            </StandaloneSearchBox>
            <button type="button" onClick={useCurrentLocation} style={{ padding: '0.5rem' }}>
              Use Current Location
            </button>
          </div>
        </div>

        {/* Destination location (hospital or address) */}
        <div style={{ marginBottom: '1rem', width: '100%', maxWidth: '600px' }}>
          <label style={{ color: 'blue', fontWeight: 'bold', display: 'block' }}>Destination</label>
          <StandaloneSearchBox
            onLoad={ref => (destinationSearchBoxRef.current = ref)}
            onPlacesChanged={handleDestinationPlaceChanged}
          >
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter hospital name or address"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
            />
          </StandaloneSearchBox>
        </div>

        <button type="button" onClick={handleBooking} style={{ padding: '0.5rem', backgroundColor: 'blue', color: 'white' }}>
          Book Now
        </button>
      </form>

      {/* Display booking status or error messages */}
      {isBookingComplete && <p style={{ color: 'blue', fontWeight: 'bold' }}>Booking Completed Successfully!</p>}
      {bookingError && <p style={{ color: 'red' }}>{bookingError}</p>}
    </div>
  );
};

export default RequestAssist;
