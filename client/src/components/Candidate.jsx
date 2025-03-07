import React from 'react';
import { useDispatch } from 'react-redux';
import { UiActions } from '../store/ui-slice';
import { voteActions } from '../store/vote-slice';

const Candidate = ({ image, _id: id, fullName, motto }) => {
    const dispatch = useDispatch();

    // Open confirm vote modal
    const openCandidateModal = () => {
        dispatch(UiActions.openVoteCandidateModal());
        dispatch(voteActions.changeSelectedVoteCandidate(id));
        console.log({ id, fullName, motto });

    };

    return (
        <article className="candidate">
            <div className="candidate__image">
                <img src={image} alt={fullName} />
            </div>
            <h5>{fullName?.length > 20 ? fullName.substring(0, 20) + "..." : fullName}</h5>
            <small>{motto?.length > 25 ? motto.substring(0, 25) + "..." : motto}</small>
            <button className="btn primary" onClick={openCandidateModal}>
                Vote
            </button>
        </article>
    );
};

export default Candidate;
