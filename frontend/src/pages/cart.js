import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

function CartComponent() {
    const getToken = () => localStorage.getItem('token');
    const navigate = useNavigate();
    const rootUrl = "http://localhost:5000/";

    const [productsInCart, setProductsInCart] = useState([]);

    const getAllProductsInCart = async () => {
        const token = getToken();

        if (!token) {
            toast.error("You need to be logged in to see products in cart", {
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
            let model = { userId: user._id };
            let response = await axios.post(`${rootUrl}cart/products`, model);

            const groupedProducts = groupProducts(response.data);
            setProductsInCart(groupedProducts);
            console.log(groupedProducts);

        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    toast.warn(`${error.response.data.message}`, {
                        position: "top-right",
                        theme: "dark",
                        autoClose: 3000
                    });
                }
            } else {
                toast.error(`${error.message}`, {
                    position: "top-right",
                    theme: "dark",
                });
            }
        }
    }

    const groupProducts = (cartItems) => {
        const grouped = {};
        cartItems.forEach(cart => {
            const productId = cart.producsInCartPerUser[0]._id;
            if (!grouped[productId]) {
                grouped[productId] = {
                    ...cart.producsInCartPerUser[0],
                    quantity: 1
                };
            } else {
                grouped[productId].quantity += 1;
            }
        });

        return Object.values(grouped);
    };

    useEffect(() => {
        getAllProductsInCart();
    }, []);

    function decodeToken(token) {
        try {
            const decodedToken = jwtDecode(token);
            return decodedToken;
        } catch (error) {
            return null;
        }
    }

    const calculateTotalPrice = () => {
        return productsInCart.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    };

    const calculateTotalProducts = () => {
        return productsInCart.reduce((total, product) => total + product.quantity, 0);
    };

    const removeFromCart = async (productId) => {
        if (!productId) return;

        const token = getToken();
        if (!token) return;

        const decodedToken = decodeToken(token);
        if (!decodedToken) return;

        let user = decodedToken.user;
        let model = { userId: user._id, productId: productId };

        try {
            const response = await axios.post(`${rootUrl}cart/remove`, model);
            if (response.status === 200) {
                toast.success("Product removed from cart successfully.", {
                    position: "bottom-right",
                    theme: "dark",
                    autoClose: 3000
                });
                getAllProductsInCart();  
            } else {
                toast.error(`Failed to remove product from cart.`, {
                    position: "top-right",
                    theme: "dark",
                    autoClose: 3000
                });
            }
        } catch (error) {
            toast.error(`An error occurred while removing the product.`, {
                position: "top-right",
                theme: "dark",
                autoClose: 3000
            });
        }
    };

    return (
        <>
            <div className="container mt-5">
                <h2 className="mb-4">Shopping Cart</h2>

                <table className="table table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Product Image</th>
                            <th scope="col">Product Name</th>
                            <th scope="col">Unit Price</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productsInCart.length > 0 ? (
                            productsInCart.map((product, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>
                                        <img
                                            src={`${rootUrl}${product.imageUrl}`}
                                            alt={product.name}
                                            style={{ width: '100px', height: '100px' }}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>
                                        {product.price ? `$${product.price.toFixed(2)}` : 'Price not available'}
                                    </td>
                                    <td>
                                        {/* <button onClick={()=> updateCartQuantity(product._id,-1)} className="btn btn-outline-danger me-2">
                                           -
                                        </button> */}
                                        {product.quantity}
                                        {/* <button onClick={()=> updateCartQuantity(product._id,1)} className="btn btn-outline-primary ms-2">
                                           +
                                        </button> */}
                                    </td>
                                    <td>

                                        <button onClick={() => removeFromCart(product._id)} className="btn btn-danger">
                                            X
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No products in cart</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="d-flex justify-content-between align-items-center mt-4">
                    <h5>Total Products: {calculateTotalProducts()}</h5>
                    <h5>Total Price: ${productsInCart.length > 0 ? calculateTotalPrice().toFixed(2) : '0.00'}</h5>
                    <button className='btn btn-success'>Checkout</button>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default CartComponent;
