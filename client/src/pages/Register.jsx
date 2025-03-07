import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Register = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        password: '',
        password2: '',
    });

    const changeInputHandler = (e) => {
        setUserData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };


    const registerVoter = async (e) => {
        e.preventDefault();

        try {
            // If no frontend validation errors, proceed with backend request
            await axios.post(`${process.env.REACT_APP_API_URL}/voters/register`, userData);

            // On successful registration
            toast.success("Registration successful!");
            navigate('/');
        } catch (err) {

            const errorMessage = err.response?.data?.message || "An error occurred";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };




    return (
        <section className="register">
            <div className="container register__container">
                <h2>Sign Up</h2>
                <form onSubmit={registerVoter}>
                    {error && <p className="form__error-Message">{error}</p>}
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        onChange={changeInputHandler}
                        autoComplete="true"
                        autoFocus
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={changeInputHandler}
                        autoComplete="true"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={changeInputHandler}
                        autoComplete="true"
                    />
                    <input
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        onChange={changeInputHandler}
                        autoComplete="true"
                    />
                    <p>
                        Already have an Account? <Link to="/">Sign in</Link>
                    </p>
                    <button type="submit" className="btn primary">
                        Register
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Register;
