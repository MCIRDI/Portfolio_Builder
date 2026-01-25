import { useState, useContext } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./services/authentication";

import { AppContext } from "./Context/AppContext";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const { setUser } = useContext(AppContext);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }
            const response = await register(formData);
            setUser(response.user);
            console.log("Form submitted:", formData);
            navigate("/home");
        } catch (error) {
            console.error("Authorization error:", error);
            alert("Such user already exists");
        }

    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <main>
                <div className="left-block"></div>
                <div className="right-block">
                    <div className="right-block-content">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <h1>New Account Creation</h1>
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit">Register</button>
                        </form>

                        <div className="right-block-content-sign">
                            <p>Already have account?</p>
                            <Link to="/login">
                                <p>Log in</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Register;
