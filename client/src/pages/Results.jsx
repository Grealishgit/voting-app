import React, { useEffect, useState } from 'react'
//import { elections as dummyElections } from '../data'
import ResultElection from '../components/ResultElection'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Results = () => {
    const navigate = useNavigate()

    const token = useSelector(state => state?.vote?.currentVoter?.token);
    //access control to the page
    useEffect(() => {
        if (!token) {
            toast.error("You need to Login or sign up to view this page!")
            navigate('/')

        }
    }, []);
    const [elections, setElections] = useState([])

    const getElections = async (e) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/elections`,
                { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
            const elections = await response.data;
            setElections(elections)
            toast.success("Elections fetched Successfully")
        } catch (error) {
            toast.error(error);

        }
    }

    useEffect(() => {
        getElections()
    }, [])

    return (
        <section className="results">
            <div className="container results__container">
                {
                    elections.map(election => <ResultElection key={election._id}{...election} />)
                }
            </div>
        </section>
    )
}

export default Results
