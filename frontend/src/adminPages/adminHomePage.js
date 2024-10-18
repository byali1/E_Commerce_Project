import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function AdminHomePageComponent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
      const token = localStorage.getItem('token');

      if (token) {
          const decodedToken = jwtDecode(token);

          
          if (decodedToken.user && decodedToken.user.isAdmin) {
              setIsAdmin(true);
          } else {
              setIsAdmin(false);
          }
      } else {
          setIsAdmin(false);
      }

      setLoading(false);
  }, []);

  if (loading) {
      return <div>Loading...</div>;
  }

  if (!isAdmin) {
      return <Navigate to="/" />; 
  }

  
  return (
      <ul>
          <li><Link to="/admin/edit-products">Edit Products</Link></li>
      </ul>
  );
}

export default AdminHomePageComponent;