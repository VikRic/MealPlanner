import React, { useState } from 'react';

import { useAuth } from '@clerk/clerk-react'



function MyTest() {
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(false);
    const { getToken } = useAuth() 

  const handleClick = async () => {
    setLoading(true);
        const token = await getToken()
    try {
      const response = await fetch('http:///localhost:8080/api/meal-plan', {
        method: "GET", 
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      }); 

      if (!response.ok) throw new Error('Cant get your recipes');
      const result = await response.json(); 
       console.log(result)
      setData(result); 
    } catch (error) {
      console.error('Fel vid fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='test'>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Get data'}
      </button>
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre> 
      )}
    </div>
  );
}

export default MyTest;