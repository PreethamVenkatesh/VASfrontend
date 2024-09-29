import React, { useState, useRef } from 'react'; // Importing necessary hooks from React
import axios from 'axios';// Importing Axios for HTTP requests
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api'; // Google Maps API components
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';  // Importing JWT decoding utility

const libraries = ['places']; // Google Maps libraries required for the Places API

const RequestAssist = () => {
    // State variables for storing locations, booking status, and errors
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [fromLocation, setFromLocation] = useState('');
  const [fromLatLng, setFromLatLng] = useState({ lat: null, lng: null });
  const [destination, setDestination] = useState('');
  const [destinationLatLng, setDestinationLatLng] = useState({ lat: null, lng: null });
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const fromSearchBoxRef = useRef(null); // Ref for the "from" location search box
  const destinationSearchBoxRef = useRef(null);// Ref for the "destination" search box
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

    // Function to get and use the user's current location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setFromLocation(`Lat: ${latitude}, Lng: ${longitude}`);
          setFromLatLng({ lat: latitude, lng: longitude }); // Update "from" location coordinates with user's current location
        },
        (error) => {
          console.error("Error getting the user's location", error);
        }
      );
    }
  };

  // Handles the event when the "from" location changes in the search box
  const handleFromPlaceChanged = () => {
    const places = fromSearchBoxRef.current.getPlaces(); // Get the selected places from the search box
    if (places && places.length > 0) {
      const place = places[0];
      setFromLocation(place.formatted_address || place.name); // Set the "from" location name
      const { lat, lng } = place.geometry.location;
      setFromLatLng({ lat: lat(), lng: lng() }); // Set the coordinates for the selected "from" location
    }
  };

  // Handles the event when the destination changes in the search box
  const handleDestinationPlaceChanged = () => {
    const places = destinationSearchBoxRef.current.getPlaces(); // Get the selected places from the search box
    if (places && places.length > 0) {
      const place = places[0];
      setDestination(place.formatted_address || place.name);// Set the destination name
      const { lat, lng } = place.geometry.location;
      setDestinationLatLng({ lat: lat(), lng: lng() }); // Set the coordinates for the selected destinatio
    }
  };

  // Handles the booking request when the "Book Now" button is clicked
  const handleBooking = async () => {
    // Ensure valid coordinates are entered for both the "from" and "destination" locations
    if (!fromLatLng.lat || !fromLatLng.lng || !destinationLatLng.lat || !destinationLatLng.lng) {
      setBookingError('Please enter valid location coordinates.');
      return;
    }
    
    try {
      // Decode the JWT token to get the user's email
      const decoded = jwtDecode(token);
      const decodedEmail = decoded.emailId;

      // Send booking request to the server via Axios POST request
      const response = await axios.post('http://localhost:8888/api/userlocation', {
        custLocationLat: fromLatLng.lat,
        custLocationLong: fromLatLng.lng,
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        time: new Date().toTimeString().split(' ')[0], // Current time in HH:MM:SS format
        destinationLat: destinationLatLng.lat,
        destinationLong: destinationLatLng.lng,
        customerEmailId:decodedEmail // Customer's email from JWT
      });
      console.log(response)
      console.log(decodedEmail)
      localStorage.setItem('driver',response.data.allocatedVolunteer)

      // If booking is successful, update the booking state
      if (response.status === 201) {
        setIsBookingComplete(true);
        setBookingError('');
      }
    } catch (error) {
      console.error('Error booking the request:', error);
      setBookingError('No volunteers found nearby. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', textAlign: 'center', backgroundColor: 'yellow', minHeight: '100vh' }}>
      {/* Back button */}
      <div
        style={{position: 'absolute',left: '60px',top: '40px',cursor: 'pointer',display: 'flex',alignItems: 'center'}}
        onClick={() => navigate('/customerPage')}>
        <FaArrowLeft size={30} color="blue" />
      </div>

      {/* Title */}
      <h1 style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline', fontSize: '40px' }}>Request Assistance</h1>
      
      {/* Google Maps Script Loader */}
      <LoadScript googleMapsApiKey="AIzaSyAyy8CB38wO_EDwAG8bO_WuKrO46JrvKt0" libraries={libraries}>
        {/* Form for entering locations */}
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginTop: '8rem', justifyContent: 'center', width: '100%', maxWidth: '600px' }}>
            <label style={{ color: 'blue', fontWeight: 'bold', display: 'block' }}>From</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StandaloneSearchBox
                onLoad={ref => (fromSearchBoxRef.current = ref)} // Load the search box for "from" location
                onPlacesChanged={handleFromPlaceChanged} // Handle the place change event
              >
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  placeholder="Enter your location"
                  style={{ width: '100%', padding: '0.5rem', marginRight: '0.5rem' }}
                />
              </StandaloneSearchBox>
              {/* Button to use the user's current location */}
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
          {/* Button to submit the booking */}
          <button type="button" onClick={handleBooking} style={{ padding: '0.5rem', backgroundColor: 'blue', color: 'white' }}>
            Book Now
          </button>
        </form>
      </LoadScript>

       {/* Display booking status or error messages */}
      {isBookingComplete && <p style={{ color: 'blue', fontWeight: 'bold' }}>Booking Completed Successfully!</p>}
      {bookingError && <p style={{ color: 'red' }}>{bookingError}</p>}
    </div>
  );
};

export default RequestAssist; // Export the component as default