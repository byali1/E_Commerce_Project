import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function AdminRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    
    const decodedToken = jwtDecode(token);
    
    if (!decodedToken.user || !decodedToken.user.isAdmin) {
      return <Navigate to="/" />;
    }

  } catch (error) {
    console.error("Invalid token or token decode failed:", error);
    return <Navigate to="/login" />; 
  }

  
  return <Outlet />;
}

export default AdminRoute;
