import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from "react-router-dom"
import { UiActions } from '../store/ui-slice'
import { voteActions } from '../store/vote-slice'

const Election = ({ _id: id, title, description, thumbnail }) => {

    const dispatch = useDispatch()
    const isAdmin = useSelector(state => state?.vote?.currentVoter?.isAdmin);

    const navigate = useNavigate()

    const openModal = () => {
        dispatch(UiActions.openUpdateElectionModal())
        dispatch(voteActions.changeIdOfElectionToUpdate(id))
    }

    return (
        <article className="election">
            <div className="election__image">
                <img src={thumbnail} alt={title} />
            </div>
            <div className="election__info">
                <Link to={`/elections/${id}`}><h4>{title}</h4></Link>
                <p>{description?.length > 255 ? description.substring(0, 255)
                    + "..." : description}</p>
                <div className="election__cta">
                    <Link to={`/elections/${id}`} className='btn sm' >View</Link>
                    {isAdmin &&
                        <button className='btn sm primary' onClick={openModal}>Edit</button>
                    }
                    {!isAdmin &&
                        <button className='btn sm primary' onClick={() => navigate('/results')}>
                            VOTE
                        </button>
                    }
                </div>
            </div>
        </article>
    )
}

export default Election