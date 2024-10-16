import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductEditComponent() {

    const [products, setProducts] = useState([]);

    const rootUrl = "http://localhost:5000/";
    const getProducts = async () => {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
    };


    useEffect(() => {
        getProducts();
    }, []);

    const deleteProduct = async (id, name) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the product: ${name} ?`);
        //Yes
        if (confirmDelete) {
            try {
                let model = { _id: id, name: name };

                let response = await axios.post('http://localhost:5000/delete-product', model);
                //alert(response.data.message);

                // Reload the products
                getProducts();
            } catch (error) {
                alert('There was an error deleting the product.');
            }
        }
    };

    return (
        <div className="container mt-4">
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
                                        <button className="btn btn-primary btn-sm me-2">Edit</button>
                                        {/* <button className="btn btn-success btn-sm">Add New</button> */}
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
    );
}

export default ProductEditComponent;
