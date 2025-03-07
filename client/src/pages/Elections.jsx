import React, { useEffect, useState } from 'react'
//import { elections as dummyElections } from '../data'
import Election from '../components/Election'
import AddElectionModal from '../components/AddElectionModal'
import { UiActions } from '../store/ui-slice'
import { useDispatch, useSelector } from 'react-redux'
import UpdateElectionModal from '../components/UpdateElectionModal'
import axios from 'axios'
import Loader from '../components/Loader'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'




const Elections = () => {
    const token = useSelector(state => state?.vote?.currentVoter?.token);
    //access control to the page
    useEffect(() => {
        if (!token) {
            navigate('/')

        }
    }, []);


    const [elections, setElections] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    //open add election modal
    const openModal = () => {
        dispatch(UiActions.openElectionModal())
    }

    const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin);
    const electionModalShowing = useSelector(state => state.ui.electionModalShowing)
    const updateElectionModalShowing = useSelector(state => state.ui.updateElectionModalShowing)


    const getElections = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });
            setElections(response.data);
            toast.success("Elections fetched successfully");
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
        setIsLoading(false);
    };


    useEffect(() => {
        getElections()
    }, [])

    return (
        <>
            <section className="elections">
                <div className="container elections__container">
                    <header className="elections__header">
                        <h1>Ongoing Elections</h1>
                        {isAdmin && <button className="btn primary" onClick={openModal}>Create New Election</button>}
                    </header>
                    {
                        isLoading ? <Loader /> : <menu className="election__menu">
                            {
                                elections.map(election => <Election key={election._id}{...election} />)
                            }
                        </menu>
                    }
                </div>
            </section>
            {electionModalShowing && <AddElectionModal />}
            {updateElectionModalShowing && <UpdateElectionModal />}
        </>
    )
}

export default Elections