import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api'; // Import components for Google Maps
import { useLocation, useNavigate } from 'react-router-dom';
import useGoogleMaps from './GoogleMaps';

// Map container style 
const containerStyle = {
  width: '100%',
  height: '100vh',
};

// Overlay for showing journey details
const overlayStyle = {
  position: 'absolute',
  top: '10px',
  left: '10px',
  backgroundColor: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  zIndex: '1000',
};

// Button style for ending the journey
const buttonStyle = {
  backgroundColor: 'red', 
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '10px',
};

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { startLat, startLng, patientLat, patientLong, destLat, destLng } = location.state;
  const { isLoaded, loadError } = useGoogleMaps();  // Check if Google Maps API is loaded
  
  const [directions, setDirections] = useState(null);
  const [carPosition, setCarPosition] = useState({ lat: startLat, lng: startLng });
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const carRef = useRef(null);

  const carIcon = {                                       // Car icon for the marker
    url: 'https://img.icons8.com/color/48/000000/car.png',
    scaledSize: new window.google.maps.Size(40, 40),
  };

  // useEffect to trigger route calculation once Google Maps is loaded 
  useEffect(() => {
    if (isLoaded && startLat && startLng && patientLat && patientLong && destLat && destLng) {
      calculateRoute();
    }
  }, [isLoaded, startLat, startLng, patientLat, patientLong, destLat, destLng]);

  // Function to calculate the route using Google Directions API
  const calculateRoute = () => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    // Initialize the DirectionsService
    const directionsService = new window.google.maps.DirectionsService();
    
    // Preparing request with origin, destination, and waypoints
    const request = {
      origin: { lat: startLat, lng: startLng },
      destination: { lat: destLat, lng: destLng },
      waypoints: [{ location: { lat: patientLat, lng: patientLong } }],
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    // Making request to Google Directions API
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        setDirections(result);
        const route = result.routes[0];
        const leg = route.legs[0]; 
        const distanceInKm = leg.distance.value / 1000; 
        const distanceInMiles = (distanceInKm * 0.621371).toFixed(2); 

        setDistance(`${distanceInMiles} miles`);
        setDuration(leg.duration.text);

        animateCarAlongRoute(result.routes[0].overview_path);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });
  };

  // Function to animate the car along the calculated route
  const animateCarAlongRoute = (path) => {
    let index = 0;
    const interval = 3000; 

    const moveCar = () => {
      if (index < path.length) {
        const nextPosition = { lat: path[index].lat(), lng: path[index].lng() };
        setCarPosition(nextPosition); 
        console.log('Car Position:', nextPosition);
        index++;
      } else {
        clearInterval(carRef.current); 
      }
    };

    carRef.current = setInterval(moveCar, interval); 
  };

  useEffect(() => {
    return () => {
      if (carRef.current) {
        clearInterval(carRef.current);
      }
    };
  }, []);

  // Function to end the journey
  const endJourney = () => {
    navigate('/home');  
  };

  // Conditional rendering in case Google Maps API fails to load
  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  // Conditional rendering to show a loading state while Google Maps API is being loaded
  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Rendering Google Map component */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={carPosition}
        zoom={15}
      >
        {/* If directions are available, render the route on the map */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: false }} 
          />
        )}
        <Marker
          position={carPosition} 
          icon={carIcon} 
        />
      </GoogleMap>
      {/* Overlay to show distance and duration */}
      <div style={overlayStyle}>
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Duration:</strong> {duration}</p>
      </div>
      {/* Overlay for the End Journey button */}
      <div style={overlayStyle}>
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Duration:</strong> {duration}</p>
        {/* Button to end the journey */}
        <button style={buttonStyle} onClick={endJourney}> 
          End Journey
        </button>
      </div>
    </div>
  );
};

export default Navigation;
