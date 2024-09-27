import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import useGoogleMaps from './GoogleMaps';

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

const Navigation = () => {
  const location = useLocation();
  const { startLat, startLng, patientLat, patientLong, destLat, destLng } = location.state;
  const { isLoaded, loadError } = useGoogleMaps();
  
  const [directions, setDirections] = useState(null);
  const [carPosition, setCarPosition] = useState({ lat: startLat, lng: startLng });
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const carRef = useRef(null);

  const carIcon = {
    url: 'https://img.icons8.com/color/48/000000/car.png',
    scaledSize: new window.google.maps.Size(40, 40),
  };

  useEffect(() => {
    if (isLoaded && startLat && startLng && patientLat && patientLong && destLat && destLng) {
      calculateRoute();
    }
  }, [isLoaded, startLat, startLng, patientLat, patientLong, destLat, destLng]);

  const calculateRoute = () => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    
    const request = {
      origin: { lat: startLat, lng: startLng },
      destination: { lat: destLat, lng: destLng },
      waypoints: [{ location: { lat: patientLat, lng: patientLong } }],
      optimizeWaypoints: true,
      travelMode: window.google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        setDirections(result);

        // Extract distance and duration from the directions response
        const route = result.routes[0];
        const leg = route.legs[0]; // For multi-leg trips, sum the legs if necessary
        
        // Convert distance to miles
        const distanceInKm = leg.distance.value / 1000; // Google Maps returns distance in meters, converting to km
        const distanceInMiles = (distanceInKm * 0.621371).toFixed(2); // Convert km to miles

        setDistance(`${distanceInMiles} miles`);
        setDuration(leg.duration.text);

        animateCarAlongRoute(result.routes[0].overview_path);
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

export default Navigation;
