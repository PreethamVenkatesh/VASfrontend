import React, { useState, useRef } from 'react';
import axios from 'axios';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ['places'];

const RequestAssist = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [fromLocation, setFromLocation] = useState('');
  const [fromLatLng, setFromLatLng] = useState({ lat: null, lng: null });
  const [destination, setDestination] = useState('');
  const [destinationLatLng, setDestinationLatLng] = useState({ lat: null, lng: null });
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const fromSearchBoxRef = useRef(null);
  const destinationSearchBoxRef = useRef(null);

  // Get the current location of the user when clicking "Use Current Location"
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

  // Handle place selection for "From" field
  const handleFromPlaceChanged = () => {
    const places = fromSearchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setFromLocation(place.formatted_address || place.name);
      const { lat, lng } = place.geometry.location;
      setFromLatLng({ lat: lat(), lng: lng() });
    }
  };

  // Handle place selection for "Destination" field
  const handleDestinationPlaceChanged = () => {
    const places = destinationSearchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setDestination(place.formatted_address || place.name);
      const { lat, lng } = place.geometry.location;
      setDestinationLatLng({ lat: lat(), lng: lng() });
    }
  };

  // Handle the booking
  const handleBooking = async () => {
    if (!fromLatLng.lat || !fromLatLng.lng || !destinationLatLng.lat || !destinationLatLng.lng) {
      setBookingError('Please enter valid location coordinates.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8888/api/userlocation', {
        custLocationLat: fromLatLng.lat,
        custLocationLong: fromLatLng.lng,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        time: new Date().toTimeString().split(' ')[0], // Current time in HH:MM:SS format
        // allocatedVolunteer: 'Preetham', // Example value, you might want to change this
        destinationLat: destinationLatLng.lat,
        destinationLong: destinationLatLng.lng,
      });

      if (response.status === 201) {
        setIsBookingComplete(true);
        setBookingError('');
      }
    } catch (error) {
      console.error('Error booking the request:', error);
      setBookingError('Error completing the booking. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline' }}>Request Assistance</h1>
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ marginTop: '8rem', justifyContent: 'center', width: '100%', maxWidth: '600px' }}>
          <label style={{ color: 'white', fontWeight: 'bold', display: 'block' }}>From</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LoadScript googleMapsApiKey="AIzaSyAyy8CB38wO_EDwAG8bO_WuKrO46JrvKt0" libraries={libraries}>
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
            </LoadScript>
            <button type="button" onClick={useCurrentLocation} style={{ padding: '0.5rem' }}>
              Use Current Location
            </button>
          </div>
        </div>
        <div style={{ marginBottom: '1rem', width: '100%', maxWidth: '600px' }}>
          <label style={{ color: 'white', fontWeight: 'bold', display: 'block' }}>Destination</label>
          <LoadScript googleMapsApiKey="AIzaSyAyy8CB38wO_EDwAG8bO_WuKrO46JrvKt0" libraries={libraries}>
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
          </LoadScript>
        </div>
        <button type="button" onClick={handleBooking} style={{ padding: '0.5rem', backgroundColor: 'blue', color: 'white' }}>
          Book Now
        </button>
      </form>

      {isBookingComplete && <p style={{ color: 'white', fontWeight: 'bold' }}>Booking Completed Successfully!</p>}
      {bookingError && <p style={{ color: 'red' }}>{bookingError}</p>}
    </div>
  );
};

export default RequestAssist;
