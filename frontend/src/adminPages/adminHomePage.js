import React from 'react'
import { Link, Navigate } from 'react-router-dom';


 function AdminHomePageComponent() {
  let isAdmin = false;

  const checkIsAdmin = () => {
    let user = JSON.parse(localStorage.getItem('user'));
    isAdmin = user.isAdmin;

}

checkIsAdmin();

if (!isAdmin) {
  return <Navigate to="/" />;
}

  return (
    <ul>
      <li><Link to="/admin/edit-products">Edit Products</Link></li>
    </ul>
  )
}

export default AdminHomePageComponent;