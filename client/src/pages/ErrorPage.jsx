import React, { useEffect } from 'react'
import Image from '../assets/404.gif'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'


const ErrorPage = () => {
    const navigate = useNavigate()

    const token = useSelector(state => state?.vote?.currentVoter?.token);
    //redirecting the user to previous page in 6 sec
    useEffect(() => {
        setTimeout(() => {
            navigate(-1)
            toast.error("Page unavailable")
        }, 6000)
    })


    return (
        <section className="errorPage">
            <div className='errorPage__container'>
                <img src={Image} alt="Page not found" />
                <h1>404</h1>
                <p>This page does not exist. You will be redirected to the homepage in a few seconds.</p>
            </div>
        </section>

    )
}

export default ErrorPage
