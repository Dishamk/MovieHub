import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Container,
  Fade,
  Pagination,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Header from '../header/Header';
import './Movies.css';

const API_KEY = '399a1822';
const API_HOST = 'https://www.omdbapi.com';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const moviesPerPage = 4;
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trendingTitles = [
          'Inception', 'Avengers', 'Interstellar', 'The Dark Knight',
          'Joker', 'Titanic', 'Gladiator', 'Avatar', 'Dune', 'Oppenheimer',
          'The Matrix', 'Forrest Gump', 'Avatar', 'Fight Club',
          'The Godfather', 'Pulp Fiction', 'Joker', 'The Prestige',
          'The Lion King', 'Whiplash'
        ];

        const requests = trendingTitles.map(title =>
          axios.get(`${API_HOST}/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`)
        );
        const responses = await Promise.all(requests);
        const validMovies = responses
          .map(res => res.data)
          .filter(movie => movie.Response === 'True');
        setMovies(validMovies);

        const storedFavorites = JSON.parse(localStorage.getItem('myMovies')) || [];
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  const handleFavorite = (movie) => {
    if (!currentUser) {
      setSnackbar({ open: true, message: 'Please log in to save movies.', severity: 'error' });
      return;
    }

    const userKey = `mymovies_${currentUser}`;
    const existing = JSON.parse(localStorage.getItem(userKey)) || [];
    const isAlreadyAdded = existing.some(m => m.imdbID === movie.imdbID);

    let updated;
    let message;

    if (isAlreadyAdded) {
      updated = existing.filter(m => m.imdbID !== movie.imdbID);
      message = 'Removed from list';
    } else {
      updated = [...existing, movie];
      message = 'Added to list';
    }

    localStorage.setItem(userKey, JSON.stringify(updated));
    localStorage.setItem('myMovies', JSON.stringify(updated));
    setFavorites(updated);
    setSnackbar({ open: true, message, severity: isAlreadyAdded ? 'warning' : 'success' });
  };

  const handleCardClick = (imdbID) => {
    navigate(`/movie/${imdbID}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

  const isFavorite = (imdbID) => favorites.some(movie => movie.imdbID === imdbID);

  return (
    <>
      <Header />
      <div className="movies-page">
        <Container className="movies-container">
          <Typography variant="h4" className="section-title" gutterBottom>
            Top Trending Movies
          </Typography>
          <Box className="movie-row">
            {currentMovies.map((movie, index) => (
              <Fade in={true} timeout={500 + index * 100} key={movie.imdbID}>
                <Card className="movie-card" onClick={() => handleCardClick(movie.imdbID)}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={movie.Poster}
                    alt={movie.Title}
                    className="movie-image"
                  />
                  <CardContent className="card-content">
                    <Typography variant="h6" className="movie-title">
                      {movie.Title}
                    </Typography>
                    <IconButton
                      className="heart-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavorite(movie);
                      }}
                    >
                      <FavoriteIcon color={isFavorite(movie.imdbID) ? 'error' : 'disabled'} />
                    </IconButton>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
          <Box className="pagination-box">
            <Pagination
              count={Math.ceil(movies.length / moviesPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={2000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </div>
    </>
  );
};

export default Movies;


















// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Movies.css';
// import { Box, Typography, Pagination } from '@mui/material';

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';
// const SECTIONS = ['Trending Now', 'Must Watch'];
// const SEARCH_TERMS = ['avengers', 'batman'];

// const Movies = () => {
//   const [movies, setMovies] = useState([[], []]);
//   const [pages, setPages] = useState([1, 1]);

//   const fetchMovies = async (sectionIndex, page) => {
//     try {
//       const searchTerm = SEARCH_TERMS[sectionIndex];
//       const response = await axios.get(`${API_HOST}/`, {
//         params: {
//           apikey: API_KEY,
//           s: searchTerm,
//           page: page,
//         },
//       });

//       const newMovies = response.data.Search || [];
//       setMovies(prev => {
//         const updated = [...prev];
//         updated[sectionIndex] = newMovies;
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//     }
//   };

//   useEffect(() => {
//     SECTIONS.forEach((_, i) => fetchMovies(i, 1));
//   }, []);

//   const handlePageChange = (sectionIndex, value) => {
//     setPages(prev => {
//       const updated = [...prev];
//       updated[sectionIndex] = value;
//       return updated;
//     });
//     fetchMovies(sectionIndex, value);
//   };

//   return (
//     <div className="movies-page">
//       {SECTIONS.map((title, index) => (
//         <Box key={index} className="section">
//           <Typography variant="h5" className="section-title">
//             {title}
//           </Typography>
//           <Box className="movie-row">
//             {movies[index].length > 0 ? (
//               movies[index].map((movie, i) => (
//                 <Box key={i} className="movie-card">
//                   <img src={movie.Poster} alt={movie.Title} />
//                   <Typography variant="body2">{movie.Title}</Typography>
//                 </Box>
//               ))
//             ) : (
//               <Typography variant="body2">No movies found.</Typography>
//             )}
//           </Box>
//           <Pagination
//             count={5}
//             page={pages[index]}
//             onChange={(_, value) => handlePageChange(index, value)}
//             className="pagination"
//           />
//         </Box>
//       ))}
//     </div>
//   );
// };

// export default Movies;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Movies.css';
// import { Box, Typography, Pagination } from '@mui/material';
// import { useNavigate } from 'react-router-dom';

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';
// const SECTIONS = ['Trending Now', 'Must Watch'];
// const SEARCH_TERMS = ['avengers', 'batman'];

// const Movies = () => {
//   const [movies, setMovies] = useState([[], []]);
//   const [pages, setPages] = useState([1, 1]);
//   const navigate = useNavigate();

//   const fetchMovies = async (sectionIndex, page) => {
//     try {
//       const searchTerm = SEARCH_TERMS[sectionIndex];
//       const response = await axios.get(`${API_HOST}/`, {
//         params: {
//           apikey: API_KEY,
//           s: searchTerm,
//           page: page,
//         },
//       });

//       const newMovies = response.data.Search || [];
//       setMovies(prev => {
//         const updated = [...prev];
//         updated[sectionIndex] = newMovies;
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//     }
//   };

//   useEffect(() => {
//     SECTIONS.forEach((_, i) => fetchMovies(i, 1));
//   }, []);

//   const handlePageChange = (sectionIndex, value) => {
//     setPages(prev => {
//       const updated = [...prev];
//       updated[sectionIndex] = value;
//       return updated;
//     });
//     fetchMovies(sectionIndex, value);
//   };

//   const handleMovieClick = (imdbID) => {
//     navigate(`/movies/${imdbID}`);
//   };

//   return (
//     <div className="movies-page">
//       {SECTIONS.map((title, index) => (
//         <Box key={index} className="section">
//           <Typography variant="h5" className="section-title">{title}</Typography>
//           <Box className="movie-row">
//             {movies[index].length > 0 ? (
//               movies[index].map((movie, i) => (
//                 <Box key={i} className="movie-card" onClick={() => handleMovieClick(movie.imdbID)}>
//                   <img src={movie.Poster} alt={movie.Title} />
//                   <Typography variant="body2">{movie.Title}</Typography>
//                 </Box>
//               ))
//             ) : (
//               <Typography variant="body2">No movies found.</Typography>
//             )}
//           </Box>
//           <Pagination
//             count={5}
//             page={pages[index]}
//             onChange={(_, value) => handlePageChange(index, value)}
//             className="pagination"
//           />
//         </Box>
//       ))}
//     </div>
//   );
// };

// export default Movies;













// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Movies.css';
// import {
//   Box,
//   Typography,
//   Pagination,
//   IconButton,
//   Tooltip,
//   AppBar,
//   Toolbar,
//   Button,
//   Grid,
// } from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import { useNavigate } from 'react-router-dom';

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';
// const SECTIONS = ['Trending Now', 'Must Watch'];
// const SEARCH_TERMS = ['avengers', 'batman'];
// const MOVIES_PER_PAGE = 6;

// const Movies = () => {
//   const [movies, setMovies] = useState([[], []]);
//   const [pages, setPages] = useState([1, 1]);
//   const [myMovies, setMyMovies] = useState(() => {
//     const saved = localStorage.getItem('myMovies');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const navigate = useNavigate();

//   const fetchMovies = async (sectionIndex, page) => {
//     try {
//       const searchTerm = SEARCH_TERMS[sectionIndex];
//       const response = await axios.get(`${API_HOST}/`, {
//         params: {
//           apikey: API_KEY,
//           s: searchTerm,
//           page: page,
//         },
//       });

//       const newMovies = response.data.Search || [];
//       setMovies(prev => {
//         const updated = [...prev];
//         updated[sectionIndex] = newMovies.slice(0, MOVIES_PER_PAGE);
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//     }
//   };

//   useEffect(() => {
//     SECTIONS.forEach((_, i) => fetchMovies(i, 1));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('myMovies', JSON.stringify(myMovies));
//   }, [myMovies]);

//   const handlePageChange = (sectionIndex, value) => {
//     setPages(prev => {
//       const updated = [...prev];
//       updated[sectionIndex] = value;
//       return updated;
//     });
//     fetchMovies(sectionIndex, value);
//   };

//   const handleMovieClick = (imdbID) => {
//     navigate(`/movies/${imdbID}`);
//   };

//   const toggleFavorite = (movie) => {
//     setMyMovies(prev => {
//       const exists = prev.find(m => m.imdbID === movie.imdbID);
//       if (exists) {
//         return prev.filter(m => m.imdbID !== movie.imdbID);
//       } else {
//         return [...prev, movie];
//       }
//     });
//   };

//   const isFavorite = (imdbID) => {
//     return myMovies.some(m => m.imdbID === imdbID);
//   };

//   return (
//     <>
//       <AppBar position="fixed">
//         <Toolbar className="header">
//           <Typography variant="h6" className="header-title">
//             MovieHub
//           </Typography>
//           <Button color="inherit" onClick={() => navigate('/mymovies')}>
//             MyMovies ({myMovies.length})
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <div className="movies-page">
//         {SECTIONS.map((title, index) => (
//           <Box key={index} className={`section ${index === 0 ? 'trending' : 'mustwatch'}`}>
//             <Typography variant="h5" className="section-title">{title}</Typography>
//             <Grid container className="movie-grid">
//               {movies[index].map((movie, i) => (
//                 <Grid item key={i} className="movie-grid-item">
//                   <Box className="movie-card">
//                     <img
//                       src={movie.Poster}
//                       alt={movie.Title}
//                       onClick={() => handleMovieClick(movie.imdbID)}
//                       className="movie-image"
//                     />
//                     <Box className="movie-info">
//                       <Typography variant="body2" className="movie-title">
//                         {movie.Title}
//                       </Typography>
//                       <Tooltip title={isFavorite(movie.imdbID) ? 'Remove from MyMovies' : 'Add to MyMovies'}>
//                         <IconButton onClick={() => toggleFavorite(movie)} className="heart-icon">
//                           {isFavorite(movie.imdbID) ? (
//                             <FavoriteIcon color="error" />
//                           ) : (
//                             <FavoriteBorderIcon />
//                           )}
//                         </IconButton>
//                       </Tooltip>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//             <Pagination
//               count={5}
//               page={pages[index]}
//               onChange={(_, value) => handlePageChange(index, value)}
//               className="pagination"
//             />
//           </Box>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Movies;-import React, { useEffect, useState } from 'react';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Movies.css';
// import {
//   Box,
//   Typography,
//   Pagination,
//   IconButton,
//   Tooltip,
//   AppBar,
//   Toolbar,
//   Button,
//   Grid,
// } from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import { useNavigate } from 'react-router-dom';

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';
// const SECTIONS = ['Trending Now'];
// const SEARCH_TERMS = ['avengers', 'batman'];
// const MOVIES_PER_PAGE = 6;

// const Movies = () => {
//   const [movies, setMovies] = useState([[], []]);
//   const [pages, setPages] = useState([1, 1]);
//   const [myMovies, setMyMovies] = useState(() => {
//     const saved = localStorage.getItem('myMovies');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const navigate = useNavigate();

//   const fetchMovies = async (sectionIndex, page) => {
//     try {
//       const searchTerm = SEARCH_TERMS[sectionIndex];
//       const response = await axios.get(`${API_HOST}/`, {
//         params: {
//           apikey: API_KEY,
//           s: searchTerm,
//           page: page,
//         },
//       });

//       const newMovies = response.data.Search || [];
//       setMovies(prev => {
//         const updated = [...prev];
//         updated[sectionIndex] = newMovies.slice(0, MOVIES_PER_PAGE);
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//     }
//   };

//   useEffect(() => {
//     SECTIONS.forEach((_, i) => fetchMovies(i, 1));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('myMovies', JSON.stringify(myMovies));
//   }, [myMovies]);

//   const handlePageChange = (sectionIndex, value) => {
//     setPages(prev => {
//       const updated = [...prev];
//       updated[sectionIndex] = value;
//       return updated;
//     });
//     fetchMovies(sectionIndex, value);
//   };

//   const handleMovieClick = (imdbID) => {
//     navigate(`/movies/${imdbID}`);
//   };

//   const toggleFavorite = (movie) => {
//     setMyMovies(prev => {
//       const exists = prev.find(m => m.imdbID === movie.imdbID);
//       if (exists) {
//         return prev.filter(m => m.imdbID !== movie.imdbID);
//       } else {
//         return [...prev, movie];
//       }
//     });
//   };

//   const isFavorite = (imdbID) => {
//     return myMovies.some(m => m.imdbID === imdbID);
//   };

//   return (
//     <>
//       <AppBar position="fixed">
//         <Toolbar className="header">
//           <Typography variant="h6" className="header-title">
//             MovieHub
//           </Typography>
//           <Button color="inherit" onClick={() => navigate('/mymovies')}>
//             MyMovies ({myMovies.length})
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <div className="movies-page">
//         {SECTIONS.map((title, index) => (
//           <Box key={index} className={`section ${index === 0 ? 'trending' : 'mustwatch'}`}>
//             <Typography variant="h5" className="section-title">{title}</Typography>
//             <Grid container className="movie-grid">
//               {movies[index].map((movie, i) => (
//                 <Grid item key={i} className="movie-grid-item">
//                   <Box className="movie-card">
//                     <img
//                       src={movie.Poster}
//                       alt={movie.Title}
//                       onClick={() => handleMovieClick(movie.imdbID)}
//                       className="movie-image"
//                     />
//                     <Box className="movie-info">
//                       <Typography variant="body2" className="movie-title">
//                         {movie.Title}
//                       </Typography>
//                       <Tooltip title={isFavorite(movie.imdbID) ? 'Remove from MyMovies' : 'Add to MyMovies'}>
//                         <IconButton onClick={() => toggleFavorite(movie)} className="heart-icon">
//                           {isFavorite(movie.imdbID) ? (
//                             <FavoriteIcon color="error" />
//                           ) : (
//                             <FavoriteBorderIcon />
//                           )}
//                         </IconButton>
//                       </Tooltip>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//             <Pagination
//               count={5}
//               page={pages[index]}
//               onChange={(_, value) => handlePageChange(index, value)}
//               className="pagination"
//             />
//           </Box>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Movies;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Movies.css';
// //import Header from '../../Header';
// import Header from '../Header';


// import {
//   Box,
//   Typography,
//   Pagination,
//   IconButton,
//   Tooltip,
//   Grid,
// } from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import { useNavigate } from 'react-router-dom';
// //import Header from '../Header'; // ✅ Import the reusable Header

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';
// const SECTIONS = ['Trending Now'];
// const SEARCH_TERMS = ['avengers', 'batman'];
// const MOVIES_PER_PAGE = 6;

// const Movies = () => {
//   const [movies, setMovies] = useState([[], []]);
//   const [pages, setPages] = useState([1, 1]);
//   const [myMovies, setMyMovies] = useState(() => {
//     const saved = localStorage.getItem('myMovies');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const navigate = useNavigate();

//   const fetchMovies = async (sectionIndex, page) => {
//     try {
//       const searchTerm = SEARCH_TERMS[sectionIndex];
//       const response = await axios.get(`${API_HOST}/`, {
//         params: {
//           apikey: API_KEY,
//           s: searchTerm,
//           page: page,
//         },
//       });

//       const newMovies = response.data.Search || [];
//       setMovies(prev => {
//         const updated = [...prev];
//         updated[sectionIndex] = newMovies.slice(0, MOVIES_PER_PAGE);
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//     }
//   };

//   useEffect(() => {
//     SECTIONS.forEach((_, i) => fetchMovies(i, 1));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('myMovies', JSON.stringify(myMovies));
//   }, [myMovies]);

//   const handlePageChange = (sectionIndex, value) => {
//     setPages(prev => {
//       const updated = [...prev];
//       updated[sectionIndex] = value;
//       return updated;
//     });
//     fetchMovies(sectionIndex, value);
//   };

//   const handleMovieClick = (imdbID) => {
//     navigate(`/movies/${imdbID}`);
//   };

//   const toggleFavorite = (movie) => {
//     setMyMovies(prev => {
//       const exists = prev.find(m => m.imdbID === movie.imdbID);
//       if (exists) {
//         return prev.filter(m => m.imdbID !== movie.imdbID);
//       } else {
//         return [...prev, movie];
//       }
//     });
//   };

//   const isFavorite = (imdbID) => {
//     return myMovies.some(m => m.imdbID === imdbID);
//   };

//   return (
//     <>
//       <Header /> {/* ✅ Reusable Header */}
//       <div className="movies-page">
//         {SECTIONS.map((title, index) => (
//           <Box key={index} className={`section ${index === 0 ? 'trending' : 'mustwatch'}`}>
//             <Typography variant="h5" className="section-title">{title}</Typography>
//             <Grid container className="movie-grid">
//               {movies[index].map((movie, i) => (
//                 <Grid item key={i} className="movie-grid-item">
//                   <Box className="movie-card">
//                     <img
//                       src={movie.Poster}
//                       alt={movie.Title}
//                       onClick={() => handleMovieClick(movie.imdbID)}
//                       className="movie-image"
//                     />
//                     <Box className="movie-info">
//                       <Typography variant="body2" className="movie-title">
//                         {movie.Title}
//                       </Typography>
//                       <Tooltip title={isFavorite(movie.imdbID) ? 'Remove from MyMovies' : 'Add to MyMovies'}>
//                         <IconButton onClick={() => toggleFavorite(movie)} className="heart-icon">
//                           {isFavorite(movie.imdbID) ? (
//                             <FavoriteIcon color="error" />
//                           ) : (
//                             <FavoriteBorderIcon />
//                           )}
//                         </IconButton>
//                       </Tooltip>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//             <Pagination
//               count={5}
//               page={pages[index]}
//               onChange={(_, value) => handlePageChange(index, value)}
//               className="pagination"
//             />
//           </Box>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Movies;


// correct one
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Movies.css';
// import {
//   Box,
//   Typography,
//   Pagination,
//   IconButton,
//   Tooltip,
//   AppBar,
//   Toolbar,
//   Button,
//   Grid,
// } from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import { useNavigate } from 'react-router-dom';

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';
// const SECTIONS = ['Trending Now'];
// const SEARCH_TERMS = ['avengers', 'batman'];
// const MOVIES_PER_PAGE = 6;

// const Movies = () => {
//   const [movies, setMovies] = useState([[], []]);
//   const [pages, setPages] = useState([1, 1]);
//   const [myMovies, setMyMovies] = useState(() => {
//     const saved = localStorage.getItem('myMovies');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const navigate = useNavigate();

//   const fetchMovies = async (sectionIndex, page) => {
//     try {
//       const searchTerm = SEARCH_TERMS[sectionIndex];
//       const response = await axios.get(`${API_HOST}/`, {
//         params: {
//           apikey: API_KEY,
//           s: searchTerm,
//           page: page,
//         },
//       });

//       const newMovies = response.data.Search || [];
//       setMovies(prev => {
//         const updated = [...prev];
//         updated[sectionIndex] = newMovies.slice(0, MOVIES_PER_PAGE);
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//     }
//   };

//   useEffect(() => {
//     SECTIONS.forEach((_, i) => fetchMovies(i, 1));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('myMovies', JSON.stringify(myMovies));
//   }, [myMovies]);

//   const handlePageChange = (sectionIndex, value) => {
//     setPages(prev => {
//       const updated = [...prev];
//       updated[sectionIndex] = value;
//       return updated;
//     });
//     fetchMovies(sectionIndex, value);
//   };

//   const handleMovieClick = (imdbID) => {
//     navigate(`/movies/${imdbID}`);
//   };

//   const toggleFavorite = (movie) => {
//     setMyMovies(prev => {
//       const exists = prev.find(m => m.imdbID === movie.imdbID);
//       if (exists) {
//         return prev.filter(m => m.imdbID !== movie.imdbID);
//       } else {
//         return [...prev, movie];
//       }
//     });
//   };

//   const isFavorite = (imdbID) => {
//     return myMovies.some(m => m.imdbID === imdbID);
//   };

//   return (
//     <>
//       <AppBar position="fixed">
//         <Toolbar className="header">
//           <Typography variant="h6" className="header-title">
//             MovieHub
//           </Typography>
//           <Button color="inherit" onClick={() => navigate('/mymovies')}>
//             MyMovies ({myMovies.length})
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <div className="movies-page">
//         {SECTIONS.map((title, index) => (
//           <Box key={index} className={`section ${index === 0 ? 'trending' : 'mustwatch'}`}>
//             <Typography variant="h5" className="section-title">{title}</Typography>
//             <Grid container className="movie-grid">
//               {movies[index].map((movie, i) => (
//                 <Grid item key={i} className="movie-grid-item">
//                   <Box className="movie-card">
//                     <img
//                       src={movie.Poster}
//                       alt={movie.Title}
//                       onClick={() => handleMovieClick(movie.imdbID)}
//                       className="movie-image"
//                     />
//                     <Box className="movie-info">
//                       <Typography variant="body2" className="movie-title">
//                         {movie.Title}
//                       </Typography>
//                       <Tooltip title={isFavorite(movie.imdbID) ? 'Remove from MyMovies' : 'Add to MyMovies'}>
//                         <IconButton onClick={() => toggleFavorite(movie)} className="heart-icon">
//                           {isFavorite(movie.imdbID) ? (
//                             <FavoriteIcon color="error" />
//                           ) : (
//                             <FavoriteBorderIcon />
//                           )}
//                         </IconButton>
//                       </Tooltip>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//             <Pagination
//               count={5}
//               page={pages[index]}
//               onChange={(_, value) => handlePageChange(index, value)}
//               className="pagination"
//             />
//           </Box>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Movies;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './Movies.css';
// import {
//   Box,
//   Typography,
//   Pagination,
//   IconButton,
//   Tooltip,
//   Button,
//   Grid,
// } from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import { useNavigate } from 'react-router-dom';
// import Header from '../pages/Header'; // ✅ Import Header

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';
// const SECTIONS = ['Trending Now'];
// const SEARCH_TERMS = ['avengers', 'batman'];
// const MOVIES_PER_PAGE = 6;

// const Movies = () => {
//   const [movies, setMovies] = useState([[], []]);
//   const [pages, setPages] = useState([1, 1]);
//   const [myMovies, setMyMovies] = useState(() => {
//     const saved = localStorage.getItem('myMovies');
//     return saved ? JSON.parse(saved) : [];
//   });

//   const navigate = useNavigate();

//   const fetchMovies = async (sectionIndex, page) => {
//     try {
//       const searchTerm = SEARCH_TERMS[sectionIndex];
//       const response = await axios.get(`${API_HOST}/`, {
//         params: {
//           apikey: API_KEY,
//           s: searchTerm,
//           page: page,
//         },
//       });

//       const newMovies = response.data.Search || [];
//       setMovies(prev => {
//         const updated = [...prev];
//         updated[sectionIndex] = newMovies
//           .filter(movie => movie.Title.length <= 35)
//           .slice(0, MOVIES_PER_PAGE);
//         return updated;
//       });
//     } catch (error) {
//       console.error('Error fetching movies:', error);
//     }
//   };

//   useEffect(() => {
//     SECTIONS.forEach((_, i) => fetchMovies(i, 1));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('myMovies', JSON.stringify(myMovies));
//   }, [myMovies]);

//   const handlePageChange = (sectionIndex, value) => {
//     setPages(prev => {
//       const updated = [...prev];
//       updated[sectionIndex] = value;
//       return updated;
//     });
//     fetchMovies(sectionIndex, value);
//   };

//   const handleMovieClick = (imdbID) => {
//     navigate(`/movies/${imdbID}`);
//   };

//   const toggleFavorite = (movie) => {
//     setMyMovies(prev => {
//       const exists = prev.find(m => m.imdbID === movie.imdbID);
//       if (exists) {
//         return prev.filter(m => m.imdbID !== movie.imdbID);
//       } else {
//         return [...prev, movie];
//       }
//     });
//   };

//   const isFavorite = (imdbID) => {
//     return myMovies.some(m => m.imdbID === imdbID);
//   };

//   return (
//     <>
//       <Header /> {/* ✅ Replaced AppBar with custom Header */}

//       <div className="movies-page">
//         {SECTIONS.map((title, index) => (
//           <Box key={index} className={`section ${index === 0 ? 'trending' : 'mustwatch'}`}>
//             <Typography variant="h5" className="section-title">{title}</Typography>
//             <Grid container className="movie-grid">
//               {movies[index].map((movie, i) => (
//                 <Grid item key={i} className="movie-grid-item">
//                   <Box className="movie-card">
//                     <img
//                       src={movie.Poster}
//                       alt={movie.Title}
//                       onClick={() => handleMovieClick(movie.imdbID)}
//                       className="movie-image"
//                     />
//                     <Box className="movie-info">
//                       <Typography variant="body2" className="movie-title">
//                         {movie.Title}
//                       </Typography>
//                       <Tooltip title={isFavorite(movie.imdbID) ? 'Remove from MyMovies' : 'Add to MyMovies'}>
//                         <IconButton onClick={() => toggleFavorite(movie)} className="heart-icon">
//                           {isFavorite(movie.imdbID) ? (
//                             <FavoriteIcon color="error" />
//                           ) : (
//                             <FavoriteBorderIcon />
//                           )}
//                         </IconButton>
//                       </Tooltip>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//             <Pagination
//               count={5}
//               page={pages[index]}
//               onChange={(_, value) => handlePageChange(index, value)}
//               className="pagination"
//             />
//           </Box>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Movies;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   IconButton,
//   Container,
//   Fade,
//   Pagination,
//   Box
// } from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import Header from '../pages/Header'; // ✅ Import Header
// import './Movies.css';

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';

// const Movies = () => {
//   const [movies, setMovies] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const moviesPerPage = 4;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
        
// const trendingTitles = [
//   'Inception', 'Avengers', 'Interstellar', 'The Dark Knight',
//   'Joker', 'Titanic', 'Gladiator', 'Avatar', 'Dune', 'Oppenheimer',
//   'The Matrix', 'Forrest Gump', 'The Shawshank Redemption', 'Fight Club',
//   'The Godfather', 'Pulp Fiction', 'The Lord of the Rings', 'The Prestige',
//   'The Lion King', 'Whiplash'
// ];

//         const requests = trendingTitles.map(title =>
//           axios.get(`${API_HOST}/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`)
//         );
//         const responses = await Promise.all(requests);
//         const validMovies = responses
//           .map(res => res.data)
//           .filter(movie => movie.Response === 'True');
//         setMovies(validMovies);
//       } catch (error) {
//         console.error('Error fetching movies:', error);
//       }
//     };

//     fetchMovies();
//   }, []);

//   const handleFavorite = (movie) => {
//     setFavorites((prev) => [...prev, movie]);
//     // Add your logic to store in "My Movies"
//   };

//   const handleCardClick = (imdbID) => {
//     navigate(`/movie/${imdbID}`);
//   };

//   const indexOfLastMovie = currentPage * moviesPerPage;
//   const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
//   const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   return (
//     <>
//       <Header />
//       <Container className="movies-container">
//         <Typography variant="h4" className="section-title" gutterBottom>
//           Top Trending Movies
//         </Typography>
//         <Box className="movie-row">
//           {currentMovies.map((movie, index) => (
//             <Fade in={true} timeout={500 + index * 100} key={movie.imdbID}>
//               <Card className="movie-card" onClick={() => handleCardClick(movie.imdbID)}>
//                 <CardMedia
//                   component="img"
//                   height="300"
//                   image={movie.Poster}
//                   alt={movie.Title}
//                   className="movie-image"
//                 />
//                 <CardContent className="card-content">
//                   <Typography variant="h6" className="movie-title">
//                     {movie.Title}
//                   </Typography>
//                   <IconButton
//                     className="heart-icon"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleFavorite(movie);
//                     }}
//                   >
//                     <FavoriteIcon color="error" />
//                   </IconButton>
//                 </CardContent>
//               </Card>
//             </Fade>
//           ))}
//         </Box>
//         <Box className="pagination-box">
//           <Pagination
//             count={Math.ceil(movies.length / moviesPerPage)}
//             page={currentPage}
//             onChange={handlePageChange}
//             color="primary"
//           />
//         </Box>
//       </Container>
//     </>
//   );
// };

// export default Movies;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   IconButton,
//   Container,
//   Fade,
//   Pagination,
//   Box,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import Header from '../pages/Header';
// import './Movies.css';

// const API_KEY = '399a1822';
// const API_HOST = 'https://www.omdbapi.com';

// const Movies = () => {
//   const [movies, setMovies] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
//   const moviesPerPage = 4;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMovies = async () => {
//       try {
//         const trendingTitles = [
//           'Inception', 'Avengers', 'Interstellar', 'The Dark Knight',
//           'Joker', 'Titanic', 'Gladiator', 'Avatar', 'Dune', 'Oppenheimer',
//           'The Matrix', 'Forrest Gump', 'The Shawshank Redemption', 'Fight Club',
//           'The Godfather', 'Pulp Fiction', 'The Lord of the Rings', 'The Prestige',
//           'The Lion King', 'Whiplash'
//         ];

//         const requests = trendingTitles.map(title =>
//           axios.get(`${API_HOST}/?t=${encodeURIComponent(title)}&apikey=${API_KEY}`)
//         );
//         const responses = await Promise.all(requests);
//         const validMovies = responses
//           .map(res => res.data)
//           .filter(movie => movie.Response === 'True');
//         setMovies(validMovies);

//         const storedFavorites = JSON.parse(localStorage.getItem('myMovies')) || [];
//         setFavorites(storedFavorites);
//       } catch (error) {
//         console.error('Error fetching movies:', error);
//       }
//     };

//     fetchMovies();
//   }, []);

//   const handleFavorite = (movie) => {
//     const existing = JSON.parse(localStorage.getItem('myMovies')) || [];
//     const isAlreadyAdded = existing.some(m => m.imdbID === movie.imdbID);

//     let updated;
//     let message;

//     if (isAlreadyAdded) {
//       updated = existing.filter(m => m.imdbID !== movie.imdbID);
//       message = 'Removed from list';
//     } else {
//       updated = [...existing, movie];
//       message = 'Added to list';
//     }

//     localStorage.setItem('myMovies', JSON.stringify(updated));
//     setFavorites(updated);
//     setSnackbar({ open: true, message, severity: isAlreadyAdded ? 'warning' : 'success' });
//   };

//   const handleCardClick = (imdbID) => {
//     navigate(`/movie/${imdbID}`);
//   };

//   const handlePageChange = (event, value) => {
//     setCurrentPage(value);
//   };

//   const indexOfLastMovie = currentPage * moviesPerPage;
//   const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
//   const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

//   const isFavorite = (imdbID) => favorites.some(movie => movie.imdbID === imdbID);

//   return (
//     <>
//       <Header />
//       <div className="movies-page">
//         <Container className="movies-container">
//           <Typography variant="h4" className="section-title" gutterBottom>
//             Top Trending Movies
//           </Typography>
//           <Box className="movie-row">
//             {currentMovies.map((movie, index) => (
//               <Fade in={true} timeout={500 + index * 100} key={movie.imdbID}>
//                 <Card className="movie-card" onClick={() => handleCardClick(movie.imdbID)}>
//                   <CardMedia
//                     component="img"
//                     height="300"
//                     image={movie.Poster}
//                     alt={movie.Title}
//                     className="movie-image"
//                   />
//                   <CardContent className="card-content">
//                     <Typography variant="h6" className="movie-title">
//                       {movie.Title}
//                     </Typography>
//                     <IconButton
//                       className="heart-icon"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleFavorite(movie);
//                       }}
//                     >
//                       <FavoriteIcon color={isFavorite(movie.imdbID) ? 'error' : 'disabled'} />
//                     </IconButton>
//                   </CardContent>
//                 </Card>
//               </Fade>
//             ))}
//           </Box>
//           <Box className="pagination-box">
//             <Pagination
//               count={Math.ceil(movies.length / moviesPerPage)}
//               page={currentPage}
//               onChange={handlePageChange}
//               color="primary"
//             />
//           </Box>
//           <Snackbar
//             open={snackbar.open}
//             autoHideDuration={2000}
//             onClose={() => setSnackbar({ ...snackbar, open: false })}
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//           >
//             <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
//               {snackbar.message}
//             </Alert>
//           </Snackbar>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default Movies;




