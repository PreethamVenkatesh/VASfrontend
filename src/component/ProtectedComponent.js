// src/components/ProtectedComponent.js
import React, { useEffect, useState } from 'react';
import { fetchWithToken } from '../utils/api';

const ProtectedComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      {data ? <div>Data: {JSON.stringify(data)}</div> : <div>Loading...</div>}
    </div>
  );
};

export default ProtectedComponent;
