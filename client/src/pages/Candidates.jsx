import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Candidate from '../components/Candidate';
import ConfirmVote from '../components/ConfirmVote';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Candidates = () => {

    const navigate = useNavigate()
    const token = useSelector(state => state?.vote?.currentVoter?.token);

    //access control to the page
    useEffect(() => {
        if (!token) {
            toast.error('You need to be logged in to view this page');
            navigate('/')

        }
    }, []);



    const { id: selectedElection } = useParams();
    const [candidates, setCandidates] = useState([]);
    const [canVote, setCanVote] = useState(true);

    // Get state values from Redux
    const voteCandidateModalShowing = useSelector(state => state.ui.voteCandidateModalShowing);

    // Default empty array if votedElections is undefined
    const voterId = useSelector(state => state?.vote?.currentVoter?.id);

    // Fetch candidates for the selected election
    const getCandidates = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/elections/${selectedElection}/candidates`,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setCandidates(response.data);
        } catch (error) {
            toast.error('Error fetching candidates:', error);
        }
    };

    //check if the user has already voted for the selected election
    const getVoter = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/voters/${voterId}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const votedElections = await response.data.votedElections;
            if (votedElections.includes(selectedElection)) {
                toast.error('You  already voted for this election');
                setCanVote(false);
            }

        } catch (error) {
            console.log(error);

        }

    }


    // Fetch candidates on component mount
    useEffect(() => {
        getCandidates();
        getVoter()
    }, [selectedElection]);

    // Check if the user has already voted for the selected election
    // useEffect(() => {
    // if (votedElections.includes(selectedElection)) {
    //    setCanVote(false);

    //  }
    //}, [selectedElection, votedElections]); // Re-run when selectedElection or votedElections changes

    return (
        <>
            <section className="candidates">
                {!canVote ? (
                    <header className="candidates__header">
                        <h1>Already voted!!</h1>
                        <p>You are only allowed to vote once in an election. Please check back later for the results.</p>
                    </header>
                ) : (
                    <>
                        {candidates.length > 0 ? (
                            <header className="candidates__header">
                                <h1>Vote for your Candidates</h1>
                                <p>These are the candidates vying for their respective positions. Please vote once and wisely as voting twice is not allowed by the system.</p>
                            </header>
                        ) : (
                            <header className="candidates__header">
                                <h1>INACTIVE ELECTION</h1>
                                <p>There are no candidates for this election at the moment. Please check back later.</p>
                            </header>
                        )}
                        <div className="container candidates__container">
                            {candidates.map(candidate => (
                                <Candidate key={candidate._id} {...candidate} />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {voteCandidateModalShowing && <ConfirmVote selectedElection={selectedElection} />}
        </>
    );
};

export default Candidates;
