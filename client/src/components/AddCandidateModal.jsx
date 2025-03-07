import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux'
import { UiActions } from '../store/ui-slice'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddCandidateModal = () => {


    const [fullName, setFullName] = useState("")
    const [motto, setMotto] = useState("")
    const [image, setImage] = useState("")


    const dispatch = useDispatch()
    const navigate = useNavigate()

    const closeModel = () => {
        dispatch(UiActions.closeAddCandidateModal())
    }


    const token = useSelector(state => state?.vote?.currentVoter?.token)
    const electionId = useSelector(state => state?.vote?.addCandidateElectionId)


    const addCandidate = async (e) => {
        try {
            e.preventDefault();
            const candidateInfo = new FormData();
            candidateInfo.set('fullName', fullName);
            candidateInfo.set('motto', motto);
            candidateInfo.set('image', image);
            candidateInfo.set('currentElection', electionId);

            console.log("Election ID:", electionId);


            await axios.post(`${process.env.REACT_APP_API_URL}/candidates`, candidateInfo, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Candidate added successfully');
            navigate(0);
        } catch (error) {

            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'An error occurred while adding the candidate';

            console.error('Error adding candidate:', error);
            toast.error(errorMessage);
        }
    };


    return (
        <section className="modal">
            <div className="modal__content">
                <header className="modal__header">
                    <h4>Add Candidate</h4>
                    <button className="modal__close" onClick={closeModel}>
                        <IoMdClose />
                    </button>
                </header>
                <form onSubmit={addCandidate}>
                    <div>
                        <h6>Candidate Name:</h6>
                        <input type="text" value={fullName} name='fullName' onChange={e => setFullName(e.target.value)} />
                    </div>
                    <div>
                        <h6>Candidate Motto:</h6>
                        <input type="text" name='motto' value={motto} onChange={e => setMotto(e.target.value)} />
                    </div>
                    <div>
                        <h6>Candidate Thumbnail:</h6>
                        <input type="file" onChange={e => setImage(e.target.files[0])} name='thumbnail' accept='png,jpg,avif,jpeg,webp' />
                    </div>
                    <button type='submit' className="btn primary">Add Candidate</button>
                </form>
            </div>
        </section>
    )
}

export default AddCandidateModal