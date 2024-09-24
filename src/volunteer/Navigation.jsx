import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useLocation } from 'react-router-dom';
import useGoogleMaps from './GoogleMaps';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const Navigation = () => {
  const location = useLocation();
  const { startLat, startLng, patientLat, patientLong, destLat, destLng } = location.state;
  const { isLoaded, loadError } = useGoogleMaps();
  
  const [directions, setDirections] = useState(null);
  const [carPosition, setCarPosition] = useState({ lat: startLat, lng: startLng });
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
        animateCarAlongRoute(result.routes[0].overview_path); // Start animation
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });
  };

  const animateCarAlongRoute = (path) => {
    let index = 0;
    const interval = 1000; // Update position every second

    const moveCar = () => {
      if (index < path.length) {
        const nextPosition = { lat: path[index].lat(), lng: path[index].lng() };
        setCarPosition(nextPosition); // Update car's position
        console.log('Car Position:', nextPosition); // Log the position
        index++;
      } else {
        clearInterval(carRef.current); // Stop animation when route ends
      }
    };

    carRef.current = setInterval(moveCar, interval); // Move car every second
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
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={carPosition} // Center the map on the car position
      zoom={10}
    >
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{ suppressMarkers: true }} // Suppress default markers
        />
      )}
      
      {/* Car marker */}
      <Marker
        position={carPosition} // Car's current position
        icon={carIcon} // Custom car icon
      />
    </GoogleMap>
  );
};

export default Navigation;
