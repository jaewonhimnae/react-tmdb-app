import React, { Suspense, useState } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
import { API_KEY, API_URL} from "./Config"
import axios from 'axios';

// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import MovieDetail from "./views/MovieDetail/MovieDetail"
import FavoritePage from "./views/FavoritePage/FavoritePage"
import Profile from "./views/Profile/Profile"

function App() {
  const [searching, setSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [Movies, setMovies] = useState([])
  const [MainMovieImage, setMainMovieImage] = useState(null)
  const [Loading, setLoading] = useState(true)
  const [CurrentPage, setCurrentPage] = useState(0)

  function handleQueryChange(newQuery, page = 1) {
    setSearchTerm(newQuery)
    if (newQuery) {
        axios.get(`${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${newQuery}&page=${page}&include_adult=false`)
        .then(response => {
          // console.log(response);
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
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar onSubmit={handleQueryChange}/>
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/"
            render={
              () => (
                <LandingPage 
                  searchTerm={searchTerm}searching={searching}
                  Movies={Movies} setMovies={setMovies}
                  MainMovieImage={MainMovieImage} setMainMovieImage={setMainMovieImage}
                  Loading={Loading} setLoading={setLoading}
                  CurrentPage={CurrentPage} setCurrentPage={setCurrentPage}
                />
              )} 
            // component={Auth(LandingPage, null)} 
          />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/movie/:movieId" component={Auth(MovieDetail, null)} />
          <Route exact path="/favorite" component={Auth(FavoritePage, null)} />
          <Route exact path="/profile" component={Auth(Profile, null)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
