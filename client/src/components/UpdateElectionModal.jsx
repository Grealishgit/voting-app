import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/ui-slice';
import axios from 'axios';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';

const UpdateElectionModal = () => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const dispatch = useDispatch()
    const idOfElectionToUpdate = useSelector(state => state.vote?.idOfElectionToUpdate)
    const token = useSelector(state => state?.vote?.currentVoter?.token);
    console.log(idOfElectionToUpdate);


    //close election modal

    const closeModel = () => {
        dispatch(UiActions.closeUpdateElectionModal())
    }

    const navigate = useNavigate()

    const fetchElection = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
            const election = await response.data
            setTitle(election.title)
            setDescription(election.description)
        } catch (error) {
            toast.error(error)
        }
    }

    const updateElection = async (e) => {
        e.preventDefault()
        try {
            const electionData = new FormData();
            electionData.set('title', title);
            electionData.set('description', description);
            electionData.set('thumbnail', thumbnail);
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`, electionData,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
            toast.success('Election updated successfully')
            navigate(0)
            closeModel()
        } catch (error) {
            toast.error(error)

        }


    }

    useEffect(() => {
        fetchElection()
    }, [])

    return (
        <section className="modal">
            <div className="modal__content">
                <header className="modal__header">
                    <h4>Edit Elections</h4>
                    <button className="modal__close" onClick={closeModel}>
                        <IoMdClose />
                    </button>
                </header>
                <form onSubmit={updateElection}>
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
                    <button type='submit' className="btn primary">Update Election</button>
                </form>
            </div>

        </section>
    )
}

export default UpdateElectionModal