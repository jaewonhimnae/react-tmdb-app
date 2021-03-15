import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Typography, Row } from 'antd';
import { API_URL, API_KEY, IMAGE_BASE_URL, IMAGE_SIZE, POSTER_SIZE } from '../../Config'
import MainImage from './Sections/MainImage'
import GridCard from '../../commons/GridCards'
import { useSelector } from 'react-redux'

const { Title } = Typography;

function LandingPage() {
    const [searching, setSearching] = useState(false)
    const [Movies, setMovies] = useState([])
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [Loading, setLoading] = useState(true)
    const [CurrentPage, setCurrentPage] = useState(0)

    let searchTerm = useSelector(state => state.searchTerm)
    
    const handleSearchMovies = (searchTerm, page = 1) => {
        if (searchTerm) {
            axios.get(`${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${page}&include_adult=false`)
            .then(response => {
            if (response.status === 200) {
                setSearching(true)
                const result = response.data
                try {
                if (result.page === 1)
                    setMovies([...result.results])
                else
                    setMovies([...Movies, ...result.results])
                setMainMovieImage(MainMovieImage || result.results[0])
                setCurrentPage(result.page)
                setLoading(false)
                }
                catch (error){
                    // console.error('Error:', error)
                }
            }
            });
        }
        else {
            setSearching(false);
        }
    }
    useEffect(() => {
        if(searchTerm !== null || searchTerm !== ''){
            handleSearchMovies(searchTerm)
        }
    }, [searchTerm])

    const buttonRef = useRef(null);

    useEffect(() => {
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        fetchMovies(endpoint)
    }, [])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])

    const fetchMovies = (endpoint) => {
        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                setMovies([...Movies, ...result.results])
                setMainMovieImage(MainMovieImage || result.results[0])
                setCurrentPage(result.page)
                }, setLoading(false))
                .catch(error => console.error('Error:', error)
            )
    }

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        if (!searching)
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
        else 
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}&page=${CurrentPage + 1}&include_adult=false`;
        fetchMovies(endpoint);
    }

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 1) {

            loadMoreItems()
            // console.log('clicked')
            buttonRef.current.click();

        }
    }

    return (
        <div style={{ width: '100%', margin: '0' }}>
            {MainMovieImage &&
                <MainImage
                    image={`${IMAGE_BASE_URL}${IMAGE_SIZE}${MainMovieImage.backdrop_path}`}
                    title={MainMovieImage.original_title}
                    text={MainMovieImage.overview}
                />
            }

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <Title level={2} > 
                    { searching ? "Results" : "Movies by latest" }
                    {/* Movies by latest */}
                </Title>
                <hr />
                <Row gutter={[16, 16]}>
                    {Movies && Movies.map((movie, index) => (
                        <React.Fragment key={index}>
                            <GridCard
                                image={movie.poster_path ?
                                    `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                                    : null}
                                movieId={movie.id}
                                movieName={movie.original_title}
                            />
                        </React.Fragment>
                    ))}
                </Row>

                {Loading &&
                    <div>Loading...</div>}

                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>Load More</button>
                </div>
            </div>

        </div>
    )
}

export default LandingPage
