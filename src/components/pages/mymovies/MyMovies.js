import React, { useEffect, useState } from 'react';
import './MyMovies.css';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';

const MyMovies = () => {
  const [myMovies, setMyMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('myMovies');
    if (saved) {
      setMyMovies(JSON.parse(saved));
    }
  }, []);

  const removeMovie = (imdbID) => {
    const updated = myMovies.filter(movie => movie.imdbID !== imdbID);
    setMyMovies(updated);
    localStorage.setItem('myMovies', JSON.stringify(updated));
  };

  const handleMovieClick = (imdbID) => {
    navigate(`/movie/${imdbID}`); 
  };

  return (
    <div className="movies-page">
      <Header />
      <Typography variant="h5" className="section-title">My Movies</Typography>
      <Box className="movie-row">
        {myMovies.length > 0 ? (
          myMovies.map((movie, i) => (
            <Box key={i} className="movie-card">
              <img
                src={movie.Poster}
                alt={movie.Title}
                onClick={() => handleMovieClick(movie.imdbID)}
                className="movie-image"
              />
              <Box className="movie-info">
                <Typography variant="body2" className="movie-title">
                  {movie.Title}
                </Typography>
                <Tooltip title="Remove from MyMovies">
                  <IconButton onClick={() => removeMovie(movie.imdbID)} className="heart-icon">
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))
        ) : (
          <Typography variant="body2" style={{ paddingLeft: '10px' }}>
            No movies added yet.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default MyMovies;

















