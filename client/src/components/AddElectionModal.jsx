import React, { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/ui-slice';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const AddElectionModal = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const dispatch = useDispatch()
    const navigate = useNavigate()

    //close election modal

    const closeModal = () => {
        dispatch(UiActions.closeElectionModal())
    }

    const token = useSelector(state => state?.vote?.currentVoter?.token);


    const createElection = async (e) => {
        e.preventDefault()
        try {
            const electionData = new FormData();
            electionData.set('title', title);
            electionData.set('description', description);
            electionData.set('thumbnail', thumbnail);
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/elections`, electionData,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
            toast.success('Election created successfully')
            closeModal()
            navigate(0)
        } catch (error) {
            toast.error(error)

        }

    }


    return (
        <section className="modal">
            <div className="modal__content">
                <header className="modal__header">
                    <h4>Create New Election</h4>
                    <button className="modal__close" onClick={closeModal}>
                        <IoMdClose />
                    </button>
                </header>
                <form onSubmit={createElection}>
                    <div>
                        <h6>Election Title</h6>
                        <input type="text" onChange={e => setTitle(e.target.value)} value={title} name='title' />
                    </div>
                    <div>
                        <h6>Election Description</h6>
                        <input type="text" onChange={e => setDescription(e.target.value)} value={description} name='description' />
                    </div>
                    <div>
                        <h6>Election Thumbnail</h6>
                        <input type="file" name='thumbnail' onChange={e => setThumbnail(e.target.files[0])}
                            accept="png,jpeg,jpg,webp,avif" />
                    </div>
                    <button type='submit' className="btn primary">Add Election</button>
                </form>
            </div>

        </section>
    )
}

export default AddElectionModal