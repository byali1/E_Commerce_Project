import '../styles/product.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';



function ProductComponent() {
    const navigate = useNavigate();
    const getToken = () => localStorage.getItem('token');

    const [products, setProducts] = useState([]);
    const rootUrl = "http://localhost:5000/";

    useEffect(() => {
        const getProducts = async () => {
            const response = await axios.get(`${rootUrl}products`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(response.data);
        };

        getProducts();
    }, []);


    const addToCart = async (productId) => {
        const token = getToken();

        if (!token) {
            toast.error("You need to be logged in to add products to cart", {
                position: "top-right",
                theme: "dark",
                autoClose: 3000
            });

            setTimeout(() => {
                navigate("/login");
            }, 3000);

            return;
        }

        try {
            const decodedToken = decodeToken(token);

            if (!decodedToken) {
                toast.error("Invalid token. Please log in again.", {
                    position: "top-right",
                    theme: "dark",
                    autoClose: 3000
                });

                localStorage.removeItem('token');
        
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
        
                return;
            }

            let user = decodedToken.user;
            let model = { productId: productId, userId: user._id };

            const response = await axios.post(`${rootUrl}products/add-to-cart`, model);

            if (response.status === 200) {
                toast.success(`${response.data.message}`, {
                    position: "bottom-right",
                    theme: "dark",
                    autoClose: 3000
                });
            } 

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.warn(`${error.response.data.message}`, {
                        position: "top-right",
                        theme: "dark",
                        autoClose: 3000
                    });
                } else if (error.response.status === 404) {
                    toast.warn(`${error.response.data.message}`, {
                        position: "top-right",
                        theme: "dark",
                        autoClose: 3000
                    });
                } else {
                    toast.error("Failed to add product to cart", {
                        position: "top-right",
                        theme: "dark",
                    });
                }
            } else {
                toast.error("An error occurred while adding product to cart.", {
                    position: "top-right",
                    theme: "dark",
                });
            }
        }
    };

    function decodeToken(token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken; 
        } catch (error) {
            return null; 
        }
    }





    return (
        <>
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
                                            <span className="badge bg-warning text-dark">In Stock: {product.stock}</span>
                                            {product.stock > 0 ? <button onClick={() => addToCart(product._id)} className="btn btn-dark btn-sm">Add to Cart</button> : <span className='text-danger'>Tükendi</span>}
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
            <ToastContainer />
        </>
    );
}

export default ProductComponent;