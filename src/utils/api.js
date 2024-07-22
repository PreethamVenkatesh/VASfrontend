export const fetchWithToken = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
  
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token,
      ...options.headers,
    };
  
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error('Request failed');
    }
  
    return await response.json();
  };