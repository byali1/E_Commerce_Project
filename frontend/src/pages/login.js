import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


function LoginComponent() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            let model = {email: email, password: password};
            let response = await axios.post("http://localhost:5000/auth/login", model);

            localStorage.setItem("token", response.data.token);
            //localStorage.setItem("user", JSON.stringify(response.data.user));
            
            navigate("/");

        } catch (error) {
            console.log(error);
        }


    }



    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h3>Welcome!</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input type="email" className="form-control" value={email} onChange={(e) => { setEmail(e.target.value) }} id="email" placeholder="name@example.com" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="Enter your password" required />
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                </div>

                                <button type="submit" className="btn btn-dark w-100">Login</button>

                            </form>
                            <div className="mt-3 text-center">
                                <Link to="/" className="text-decoration-none me-5">Forgot Password</Link>
                                <Link to="/register" className="text-decoration-none">Create an account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default LoginComponent;