import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';

const Congrats = () => {
    const navigate = useNavigate();
    const token = useSelector(state => state?.vote?.currentVoter?.token);
    //access control to the page
    useEffect(() => {
        if (!token) {
            toast.error('You need to be logged in to view this page');
            navigate('/')

        }
    }, []);

    return (
        <section className="congrats">
            <div className="container congrats__container">
                <h2>
                    Thanks for your Vote!
                </h2>
                <p>
                    Your vote is now added to your candidate's vote.
                    You will be redirected shortly to see the new result
                </p>
                <Link to='/results' className='btn sm primary'>See Results</Link>
            </div>
        </section>
    )
}

export default Congrats