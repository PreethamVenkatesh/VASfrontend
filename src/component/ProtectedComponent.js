// src/components/ProtectedComponent.js
import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api'; // Import custom API function to handle authenticated requests

// ProtectedComponent: A component that fetches and displays protected data from an API
const ProtectedComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Define an async function to handle data fetching
    const fetchData = async () => {
      try {
         // Use the fetchWithToken utility to fetch protected data from the server
        const result = await fetchWithToken('http://localhost:8888/api/protected');
        setData(result);
      } catch (error) {
        console.error('Error fetching protected data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Conditionally render the fetched data if it exists, otherwise display a loading message */}
      {data ? <div>Data: {JSON.stringify(data)}</div> : <div>Loading...</div>}
    </div>
  );
};

export default ProtectedComponent; // Export the component as the default export
