import '../styles/product.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


function ProductComponent() {

    const [products, setProducts] = useState([]);
    const rootUrl = "http://localhost:5000/";

    useEffect(() => {
        const getProducts = async () => {
            const response = await axios.get('http://localhost:5000/products',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(response.data);
        };

        getProducts();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className="col-md-3 mb-4">
                            <div className="card product-card h-100 shadow-sm">
                                <div className='text-center'>
                                    <span className="badge bg-dark my-2">{product.categoryName}</span>
                                </div>
                                <img src={`${rootUrl}${product.imageUrl}`} className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text text-muted">{product.description}</p>
                                    <h6 className="card-subtitle mb-2 text-success">${product.price.toFixed(2)}</h6>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="badge bg-secondary">In Stock: {product.stock}</span>
                                        <button className="btn btn-warning btn-sm">View Details</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-6">
                        <div className="alert alert-warning" role="alert">
                            <i className="bi bi-exclamation-triangle"></i> No products available!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductComponent;