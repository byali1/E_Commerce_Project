import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from 'jwt-decode'; // to decode jwt token
import { Navigate } from 'react-router-dom';

const getToken = () => localStorage.getItem('token');

function ProductEditComponent() {
    const [products, setProducts] = useState([]);
    const [formProductData, setFormProductData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        categoryName: ''
    });
    const [image, setImage] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true); 
    const rootUrl = "http://localhost:5000/";

    useEffect(() => {
       
        const token = getToken();

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

    const handleChange = (e) => {
        setFormProductData({
            ...formProductData,
            [e.target.id]: e.target.value
        });
    };

    const getProducts = async () => {
        try {
            const token = getToken(); 
            const response = await axios.get(`${rootUrl}products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProducts(response.data);
        } catch (error) {
            toast.error("There was an error fetching the products", {
                position: "top-right",
                theme: "dark"
            });
        }
    };

    useEffect(() => {
        if (isAdmin) {
            getProducts();
        }
    }, [isAdmin]);

    const deleteProduct = async (id, name) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the product: ${name} ?`);
        if (confirmDelete) {
            try {
                const token = getToken(); 
                let model = { _id: id, name: name };
                await axios.post(`${rootUrl}admin/delete-product`, model, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                toast.success(`Product (${name}) deleted successfully!`, {
                    position: "top-right",
                    theme: "dark"
                });
                getProducts();
            } catch (error) {
                toast.error('There was an error deleting the product.', {
                    position: "top-right",
                    theme: "dark"
                });
            }
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();
    
        const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff'];
        if (!image || !allowedFileTypes.includes(image.type)) {
            toast.warn("Please select a valid image file. Allowed file types are: JPG-JPEG-PNG-WEBP-BMP-TIFF", {
                position: "top-right",
                theme: "dark"
            });
            return;
        }
    
        const maxFileSizeMB = 4;
        const imageSizeMB = bytesToMB(image.size);
        if (imageSizeMB > maxFileSizeMB) {
            toast.warn(`The file size exceeds the ${maxFileSizeMB}MB limit. Your file size is ${imageSizeMB.toFixed(2)}MB. Please select a smaller file.`, {
                position: "top-right",
                theme: "dark"
            });
            return;
        }
    
        const formData = new FormData();
        formData.append('name', formProductData.name.trim());
        formData.append('description', formProductData.description.trim());
        formData.append('price', formProductData.price.toString().trim());
        formData.append('stock', formProductData.stock.toString().trim());
        formData.append('categoryName', formProductData.categoryName.trim());
        formData.append('image', image, image.name);
    
        try {
            const token = getToken(); 
            var response = await axios.post(`${rootUrl}admin/add-product`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            toast.success(`${response.data.message}`, {
                position: "top-right",
                theme: "dark"
            });
    
            document.querySelector('[data-bs-dismiss="modal"]').click();
            getProducts();
        } catch (error) {
            toast.error(`An error occurred while adding the product.`, {
                position: "top-right",
                theme: "dark"
            });
        }
    };

    function bytesToMB(bytes) {
        const mb = bytes / (1024 * 1024);
        return mb;
    }

    
    if (loading) {
        return <div>Loading...</div>;
    }

    
    if (!isAdmin) {
        return <Navigate to="/" />; 
    }

    
    return (
        <>
            <div className="container mt-4">
                <div className='mb-4 text-center'>
                    <button className="btn btn-outline-success btn-sm" data-bs-toggle="modal" data-bs-target="#addProductModal">
                        Add New Product
                    </button>
                </div>
                {products && products.length > 0 ? (
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr className='text-center'>
                                <th scope="col">#</th>
                                <th scope="col">Category</th>
                                <th scope="col">Image</th>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Price</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Operations</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {products.map((product, index) => (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{product.categoryName}</td>
                                    <td><img src={`${rootUrl}${product.imageUrl}`} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} /></td>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td className="text-success">${product.price.toFixed(2)}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary btn-sm me-2">Update</button>
                                            <button onClick={() => deleteProduct(product._id, product.name)} className="btn btn-danger btn-sm me-2">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="col-6">
                        <div className="alert alert-warning" role="alert">
                            <i className="bi bi-exclamation-triangle"></i> No products available!
                        </div>
                    </div>
                )}
            </div>

            <div className="modal" id='addProductModal' tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add a product</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={addProduct}>
                            <div className="modal-body">
                                <div className='form-group'>
                                    <div className='mb-3'>
                                        <label htmlFor='name'>Product Name</label>
                                        <input type='text' className='form-control' value={formProductData.name} onChange={handleChange} id='name' name='name' required />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='description'>Description</label>
                                        <textarea type='text' className='form-control' value={formProductData.description} onChange={handleChange} id='description' name='description' required />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='price'>Price</label>
                                        <input type='number' className='form-control' value={formProductData.price} onChange={handleChange} id='price' name='price' required />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='stock'>Stock</label>
                                        <input type='number' className='form-control' value={formProductData.stock} onChange={handleChange} id='stock' name='stock' required />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='categoryName'>Category Name</label>
                                        <input type='text' className='form-control' value={formProductData.categoryName} onChange={handleChange} id='categoryName' name='categoryName' required />
                                    </div>
                                    <div className='mb-2'>
                                        <label htmlFor='image'>Image</label>
                                        <input type='file' className='form-control' onChange={(e) => setImage(e.target.files[0])} id='image' name='image' required />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-success">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default ProductEditComponent;
