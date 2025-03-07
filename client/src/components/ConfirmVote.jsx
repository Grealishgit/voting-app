import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/ui-slice';
import axios from 'axios';
import { voteActions } from '../store/vote-slice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ConfirmVote = ({ selectedElection }) => {

    const [modalCandidate, setModalCandidate] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Close confirm vote modal
    const closeCandidateModal = () => {
        dispatch(UiActions.closeVoteCandidateModal());
    };

    // Get selected candidate ID and voter data from Redux store
    const selectedVoteCandidate = useSelector(state => state?.vote?.selectedVoteCandidate);
    const token = useSelector(state => state?.vote?.currentVoter?.token);
    const currentVoter = useSelector(state => state?.vote?.currentVoter);
    const currentVoterId = currentVoter?.id;

    // Fetch candidate details 
    const fetchCandidate = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
            setModalCandidate(await response.data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
            toast.error("Failed to fetch candidate details.");
        }
    };

    // Confirm vote for the selected candidate
    const confirmVote = async () => {
        try {
            const requestData = {
                selectedElection,
                currentVoterId: currentVoter?.id,
            };

            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
                requestData,
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // Handle the response
            const voteResult = response.data;
            dispatch(voteActions.changeCurrentVoter({ ...currentVoter, votedElections: voteResult }));
            toast.success("Vote confirmed successfully");
            navigate('/congrats');
        } catch (error) {
            console.error("Error confirming vote:", error.response ? error.response.data : error);
            toast.error("Error confirming vote. Please try again.");
        }
        closeCandidateModal();
    };

    useEffect(() => {
        fetchCandidate();
    }, []);

    return (
        <section className="modal">
            <div className="modal__content confirm__vote-content">
                <h5>Please confirm your vote</h5>
                <div className="confirm__vote-image">
                    <img src={modalCandidate.image} alt={modalCandidate.fullName} />
                </div>
                <h2>{modalCandidate?.fullName?.length > 17 ? modalCandidate?.fullName.substring(0, 17) + '...' : modalCandidate?.fullName}</h2>
                <p>{modalCandidate?.motto?.length > 45 ? modalCandidate?.motto.substring(0, 45) + '...' : modalCandidate?.motto}</p>
                <div className="confirm__vote-cta">
                    <button className="btn" onClick={closeCandidateModal}>Cancel</button>
                    <button className="btn primary" onClick={confirmVote}>Confirm</button>
                </div>
            </div>
        </section>
    );
};

export default ConfirmVote;
