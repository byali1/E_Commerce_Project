import React from "react";
import { Link } from "react-router-dom";

function HomeComponent() {
  return (
    <>

      
      <div className="hero-section d-flex justify-content-center align-items-center text-white">
        <div className="text-center">
          <h1 className="display-3 text-dark">Welcome to E-Commerce</h1>
          <p className="lead mt-4 text-dark">Your one-stop shop for everything you need.</p>
          <Link to="/products" className="btn btn-dark btn-lg mt-3">
            Start Shopping
          </Link>

        
        </div>
      </div>

     
      <div className="container my-5">
        <h2 className="text-center mb-4">Why Shop With Us?</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm p-4">
              <i className="bi bi-truck fs-1 mb-3"></i>
              <h5 className="card-title">Fast Delivery</h5>
              <p className="card-text">
                Get your products delivered fast with our top-tier shipping services.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm p-4">
              <i className="bi bi-shield-check fs-1 mb-3"></i>
              <h5 className="card-title">Secure Payments</h5>
              <p className="card-text">
                Your payments are safe and encrypted for your peace of mind.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center border-0 shadow-sm p-4">
              <i className="bi bi-box-seam fs-1 mb-3"></i>
              <h5 className="card-title">Wide Variety</h5>
              <p className="card-text">
                Choose from a wide range of products across various categories.
              </p>
            </div>
          </div>
        </div>
      </div>

     
      <div className="container my-5">
        <h2 className="text-center mb-4">Popular Categories</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="category-box text-center p-4 border shadow-sm">
              <h5>Electronics</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="category-box text-center p-4 border shadow-sm">
              <h5>Fashion</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="category-box text-center p-4 border shadow-sm">
              <h5>Home Appliances</h5>
            </div>
          </div>
        </div>
      </div>

     
      <div className="bg-dark text-white text-center py-5">
        <h3>Sign up for our Newsletter!</h3>
        <p className="lead">Get exclusive discounts and updates right in your inbox.</p>
        <a href="#" className="btn btn-outline-light btn-lg">
          Subscribe Now
        </a>
      </div>

      
      <footer className="bg-secondary text-white text-center py-4">
        <p className="mb-0">© 2024 E-Commerce. All rights reserved.</p>
      </footer>
    </>
  );
}

export default HomeComponent;