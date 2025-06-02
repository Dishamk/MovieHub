
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../header/Header';
import {
  Container, Grid, Card, CardContent, CardMedia,
  Typography, Box, CircularProgress
} from '@mui/material';
import './Search.css';

const API_KEY = '399a1822';
const API_HOST = 'https://www.omdbapi.com';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_HOST}/?apikey=${API_KEY}&s=${query}`);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovies(data.Search.slice(0, 4));
      } else {
        setMovies([]);
        navigate('/error', { state: { error: 'Movie not found' } });
      }
    } catch (err) {
      setMovies([]);
      navigate('/error', { state: { error: 'Something went wrong. Please try again later.' } });
    } finally {
      setLoading(false);
    }
  }, [query, navigate]);

  useEffect(() => {
    if (query.length >= 3) {
      handleSearch();
    } else {
      setMovies([]);
    }
  }, [query, handleSearch]);

  return (
    <Box className="search-page">
      <Header query={query} setQuery={setQuery} onSearch={handleSearch} />
      <Container className="movie-container">
        {loading ? (
          <Box className="spinner-box">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={3} key={movie.imdbID}>
                <Card className="movie-card">
                  <CardMedia
                    component="img"
                    alt={movie.Title}
                    height="300"
                    image={
                      movie.Poster !== 'N/A'
                        ? movie.Poster
                        : 'https://via.placeholder.com/300x450?text=No+Image'
                    }
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap>{movie.Title}</Typography>
                    <Typography variant="body2" color="text.secondary">{movie.Year}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Search;
