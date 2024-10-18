import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute() {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default AdminRoute;
