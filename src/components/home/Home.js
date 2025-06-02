import React from 'react';
import { Typography, Box } from '@mui/material';
import Header from '../pages/header/Header';

import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Header />

      <Box className="welcome-box">
        <Typography variant="h3" className="welcome-message">
          Welcome to <span className="highlight">MovieHub</span>!
        </Typography>
        <Typography variant="h6" className="sub-message">
          Your ultimate destination for everything cinema.
        </Typography>
        <Typography variant="body1" className="extra-message">
          Explore the latest blockbusters, timeless classics, and hidden gems. Stay updated with reviews, trailers, and personalized recommendations.
        </Typography>
      </Box>
    </div>
  );
};

export default Home;












