import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IoAddOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux';
import ElectionCandidate from '../components/ElectionCandidate'
import { UiActions } from '../store/ui-slice';
import AddCandidateModal from '../components/AddCandidateModal';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import Loader from '../components/Loader';
import { format } from 'date-fns';
import { voteActions } from '../store/vote-slice';

const ElectionsDetails = () => {
    const token = useSelector(state => state?.vote?.currentVoter?.token);

    //access control to the page
    useEffect(() => {
        if (!token) {
            toast.error('You need to be logged in to view this page');
            navigate('/')

        }
    }, []);



    const [isLoading, setIsLoading] = useState(false)
    const [election, setElection] = useState([])
    const [candidates, setCandidates] = useState([])
    const [voters, setVoters] = useState([])

    const navigate = useNavigate()



    const { id } = useParams()
    const dispatch = useDispatch()
    const addCandidateModalShowing = useSelector(state => state.ui.addCandidateModalShowing)

    const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin);




    const getElection = async () => {
        setIsLoading(true);
        const fetchElectionPromise = new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}`, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                });
                setElection(response.data);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
        await toast.promise(
            fetchElectionPromise,
            {
                loading: 'Fetching election data...',
                success: 'Fetched successfully!',
                error: 'Could not fetch election data!',
            }
        );

        setIsLoading(false);
    };


    const getCandidates = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
            setCandidates(response.data)
            toast.success("Candidates fetched successfully")


        } catch (error) {
            toast.error(error)

        }

    }

    const getVoters = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/voters`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
            setVoters(response.data)
            toast.success("Voters fetched successfully")
        } catch (error) {
            toast.error(error)

        }
    }

    const deleteElection = async () => {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/elections/${id}`,
            { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
        toast.success("Election deleted successfully")
        navigate('/elections')
        try {

        } catch (error) {
            toast.error(error)

        }
    }

    useEffect(() => {

        getElection()
        getCandidates()
        getVoters()
    }, [])

    //open add candidate modal
    const openModal = () => {
        dispatch(UiActions.openAddCandidateModal())
        dispatch(voteActions.changeAddCandidateElectionId(id))
    }



    return (
        <>
            <section className="electionDetails">
                <div className="container electionDetails__container">
                    <h2>{election.title}</h2>
                    <p>{election.description}</p>
                    <div className="electionDetails__image">
                        <img src={election.thumbnail} alt={election.title} />
                    </div>
                    <menu className="electionDetails__candidates">

                        {
                            candidates.map(candidate => <ElectionCandidate key={candidate._id}{...candidate} />)
                        }

                        {isAdmin && <button className="add__candidate-btn" onClick={openModal}><IoAddOutline /></button>}
                    </menu>

                    <menu className="voters">
                        <h2>Voters</h2>
                        <table className="voters__table">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email Address</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    voters.map(voter => <tr key={voter._id}>

                                        <td><h5>{voter.fullName}</h5></td>
                                        <td>{voter.email}</td>
                                        <td>{format(new Date(voter.createdAt), 'dd MMM, yyyy')}</td>

                                    </tr>
                                    )
                                }

                            </tbody>
                        </table>
                    </menu>
                    {isAdmin && <button className="btn danger full" onClick={deleteElection}>Delete Election</button>}

                </div>
            </section>
            {addCandidateModalShowing && <AddCandidateModal />}
        </>


    )
}

export default ElectionsDetails
