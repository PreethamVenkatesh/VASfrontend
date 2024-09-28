import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useLocation, useNavigate } from 'react-router-dom';
import useGoogleMaps from '../volunteer/GoogleMaps';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

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
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoaded, loadError } = useGoogleMaps();
  
  // Ensure all state variables are set based on location state
  const { startLat, startLng, custLat, custLong } = location.state || {};
  const [directions, setDirections] = useState(null);
  const [carPosition, setCarPosition] = useState({ lat: startLat || 0, lng: startLng || 0 });
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const carRef = useRef(null);

  const carIcon = {
    url: 'https://img.icons8.com/color/48/000000/car.png',
    scaledSize: new window.google.maps.Size(40, 40),
  };

  // Use useEffect to calculate the route once the component mounts
  useEffect(() => {
    if (isLoaded && startLat && startLng && custLat && custLong) {
      calculateRoute();
    }
  }, [isLoaded, startLat, startLng, custLat, custLong]);

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

        setDistance(`${distanceInMiles} miles`);
        setDuration(leg.duration.text);

        animateCarAlongRoute(route.overview_path);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });
  };

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

  const endJourney = () => {
    navigate('/home');
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps...</div>;
  }

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
        <Marker
          position={carPosition}
          icon={carIcon}
        />
      </GoogleMap>
      <div style={overlayStyle}>
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Duration:</strong> {duration}</p>
      </div>
    </div>
  );
};

export default MapRide;
