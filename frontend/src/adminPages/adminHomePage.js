import React from 'react'
import { Link } from 'react-router-dom';

 function AdminHomePageComponent() {
  return (
    <ul>
      <li><Link to="/admin/edit-products">Edit Products</Link></li>
    </ul>
  )
}

export default AdminHomePageComponent;