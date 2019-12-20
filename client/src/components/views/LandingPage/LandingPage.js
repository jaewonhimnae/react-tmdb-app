import React,{useEffect} from 'react'
import { FaCode } from "react-icons/fa";
import { API_URL, API_KEY } from '../../Config'
function LandingPage() {

    useEffect(() => {
       
        fetch(`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
            .then(response=> response.json())
            .then(response => {
                console.log(response)
            })

    }, [])

    return (
        <>
        <div className="app">
            <FaCode style={{ fontSize: '4rem' }} /><br />
            <span style={{ fontSize: '2rem' }}>Let's Start Coding!</span>
        </div>
        <div style={{ float:'right' }}>Thanks For Using This Boiler Plate by John Ahn</div>
        </>
    )
}

export default LandingPage
