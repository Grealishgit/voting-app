import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { voteActions } from '../store/vote-slice';

const Login = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        fullName: "",
        email: "",
        password: "",
        password2: ""
    })

    const dispatch = useDispatch()

    const changeInputHandler = (e) => {
        setUserData(prevState => {
            return { ...prevState, [e.target.name]: e.target.value }
        })
    }


    const loginVoter = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/voters/login`, userData);
            const newVoter = response.data;

            // Save the voter data in local storage
            localStorage.setItem("currentUser", JSON.stringify(newVoter));

            // Update Redux state
            dispatch(voteActions.changeCurrentVoter(newVoter));

            toast.success("Login successful");
            navigate('/elections');
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "An error occurred, please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };



    return (
        <section className='register'>
            <div className="container register__container">
                <h2>Sign In</h2>
                <form onSubmit={loginVoter}>
                    {error && <p className="form__error-Message">{error}</p>}
                    <input type="email" name='email' placeholder='Email Address' onChange={changeInputHandler} autoComplete='true' autoFocus />
                    <input type="password" name='password' placeholder='Password' onChange={changeInputHandler} autoComplete='true' autoFocus />
                    <p>Don't have an Account? <Link to='/register'>Sign up</Link></p>
                    <button type='submit' className='btn primary'>Login</button>
                </form>
            </div>
        </section>
    )
}

export default Login
