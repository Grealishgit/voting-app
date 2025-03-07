import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { voteActions } from '../store/vote-slice';
import { toast } from 'react-hot-toast';
import Loader from '../components/Loader';

const Logout = () => {

    const token = useSelector(state => state?.vote?.currentVoter?.token);
    //access control to the page
    useEffect(() => {
        if (!token) {
            toast.error('You need to be logged in to view this page');
            navigate('/')

        }
    }, []);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        dispatch(voteActions.changeCurrentVoter(null));
        toast.success('You have been logged out successfully');
        navigate('/');
    }, [dispatch, navigate]);

    return (
        <div>
            <Loader />
            Logging out...
        </div>
    );
};

export default Logout;
