import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function LayoutComponent() {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

    const logOut = () => {
        localStorage.removeItem('token');
        navigate("/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
      
        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const decodedToken = jwtDecode(token);

            if (decodedToken.user && decodedToken.user.isAdmin) {
                setIsAdmin(true); 
            } else {
                setIsAdmin(false); 
            }

        } catch (error) {
            navigate("/login"); 
        }

    }, [navigate]);

    return (
        <>
            <nav className="navbar bg-dark navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className="navbar-brand" to="/" >E-Commerce</Link>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item mx-2">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link to="/orders">My Orders</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link to="/products">Products</Link>
                            </li>
                            {isAdmin && (
                                <li className="nav-item mx-2">
                                    <Link to="/admin" className="text-danger">Admin</Link>
                                </li>
                            )}
                        </ul>
                        <Link to="/cart" className="mx-2">Cart</Link>
                        <button onClick={logOut} className="btn btn-outline-danger" type="submit">Log out</button>
                    </div>
                </div>
            </nav>

            {/* Routing yapısı için */}
            <Outlet />
        </>
    );
}

export default LayoutComponent;
