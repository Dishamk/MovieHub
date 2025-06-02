import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../header/Header';
import './Details.css';

const API_KEY = '399a1822';
const API_HOST = 'https://www.omdbapi.com';

const Details = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [activeTab, setActiveTab] = useState(null); 

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${API_HOST}/`, {
          params: {
            apikey: API_KEY,
            i: imdbID,
            plot: 'full',
          },
        });
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  if (!movie) return <div className="movie-details">Loading...</div>;

  return (
    <>
      <div className="full-width-header">
        <Header />
      </div>
      <div className="movie-details-container">
        <img className="movie-poster" src={movie.Poster} alt={movie.Title} />
        <div className="movie-main-info">
          <h2>{movie.Title}</h2>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Year:</strong> {movie.Year}</p>
          <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>

          <div className="tab-buttons">
            <button onClick={() => setActiveTab('overview')}>Overview</button>
            <button onClick={() => setActiveTab('cast')}>Cast</button>
          </div>

          <div className="tab">
            {activeTab === 'overview' && (
              <>
                <p><strong>Plot:</strong> {movie.Plot}</p>
                <p><strong>Language:</strong> {movie.Language}</p>
                <p><strong>Awards:</strong> {movie.Awards}</p>
              </>
            )}
            {activeTab === 'cast' && (
              <>
                <p><strong>Director:</strong> {movie.Director}</p>
                <p><strong>Writer:</strong> {movie.Writer}</p>
                <p><strong>Actors:</strong> {movie.Actors}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;





