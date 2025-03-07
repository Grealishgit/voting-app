import React, { useEffect } from 'react'
import { IoMdTrash } from 'react-icons/io'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'


const ElectionCandidate = ({ fullName, image, motto, _id: id }) => {
    const navigate = useNavigate()
    const token = useSelector(state => state.vote?.currentVoter?.token)
    const isAdmin = useSelector(state => state.vote?.currentVoter?.isAdmin)


    const deleteCandidate = async () => {
        try {
            // Pass the axios.delete() promise to toast.promise
            await toast.promise(
                axios.delete(`${process.env.REACT_APP_API_URL}/candidates/${id}`, {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                }),
                {
                    loading: 'Deleting candidate...',
                    success: 'Candidate deleted successfully!',
                    error: 'Failed to delete candidate!',
                }
            );

            navigate(0); // Refresh the page after successful deletion

        } catch (error) {
            // Ensure that we are only passing a string to the toast error
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message); // Display the error message from the response
            } else if (error.message) {
                toast.error(error.message); // Display the general error message
            } else {
                toast.error('An unexpected error occurred');
            }
        }
    };



    return (
        <li className="electionCandidate">
            <div className="electionCandidate__image">
                <img src={image} alt={fullName} />
            </div>
            <div>
                <h5>{fullName}</h5>
                <small>{motto?.length > 70 ? motto.substring(0, 70) + "..." : motto}</small>
                {isAdmin &&
                    <button className="electionCandidate__btn" onClick={deleteCandidate}><IoMdTrash /></button>
                }
            </div>
        </li>
    )
}

export default ElectionCandidate