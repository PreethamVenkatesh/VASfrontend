import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api'; // Google Maps components
import { useLocation, useNavigate } from 'react-router-dom'; // Hooks to get route location and navigation
import useGoogleMaps from '../volunteer/GoogleMaps'; // Custom hook to load Google Maps

// Container style for the Google Map
const containerStyle = {
  width: '100%',
  height: '100vh',
};

// Style for the overlay displaying distance, duration, and button
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

// Style for the "Close Ride" button
const buttonStyle = {
  backgroundColor: 'red',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  marginTop: '10px',
};

const MapRide = () => {
  const location = useLocation(); // Get location state passed from the previous route
  const navigate = useNavigate(); // Hook for navigation to another route
  const { isLoaded, loadError } = useGoogleMaps(); // Custom hook to load Google Maps and handle loading states
  
// Get the start and destination coordinates from the location state, default to zero if not present
  const { startLat, startLng, custLat, custLong } = location.state || {};
  const [directions, setDirections] = useState(null);
  const [carPosition, setCarPosition] = useState({ lat: startLat || 0, lng: startLng || 0 });
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const carRef = useRef(null);

  // Custom car marker icon
  const carIcon = {
    url: 'https://img.icons8.com/color/48/000000/car.png',
    scaledSize: new window.google.maps.Size(40, 40),
  };

 // Effect to calculate and render the route once the map is loaded and coordinates are available
  useEffect(() => {
    if (isLoaded && startLat && startLng && custLat && custLong) {
      calculateRoute(); // Function to calculate and display the route
    }
  }, [isLoaded, startLat, startLng, custLat, custLong]);

  // Function to calculate the route from the start point to the destination using Google Maps Directions API
  const calculateRoute = () => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    const request = {
      origin: { lat: startLat, lng: startLng },
      destination: { lat: custLat, lng: custLong },
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        setDirections(result);
        const route = result.routes[0];
        const leg = route.legs[0];
        const distanceInKm = leg.distance.value / 1000;
        const distanceInMiles = (distanceInKm * 0.621371).toFixed(2);

        setDistance(`${distanceInMiles} miles`); // Set the distance to display
        setDuration(leg.duration.text); // Set the duration to display

        animateCarAlongRoute(route.overview_path);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });
  };

   // Function to animate the car along the calculated route path
  const animateCarAlongRoute = (path) => {
    let index = 0;
    const interval = 3000;

    // Function to update the car's position along the path
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

  // Function to end the journey and navigate back to the "currentAssist" page
  const endJourney = () => {
    navigate('/currentAssist');
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  // Main return statement rendering the map and controls
  return (
    <div style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={carPosition}
        zoom={15}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: false }}
          />
        )}
         {/* Marker for the car's current position */}
        <Marker
          position={carPosition}
          icon={carIcon}
        />
      </GoogleMap>
      <div style={overlayStyle}>
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Duration:</strong> {duration}</p>
        <button style={buttonStyle} onClick={endJourney}>
          Close Ride
        </button>
      </div>
    </div>
  );
};

export default MapRide; // Export the component
