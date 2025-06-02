import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useNavigate, useLocation } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const errorMessage = location.state?.error || 'Something went wrong.';

  const handleRetry = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/search');
    }, 1500); // Simulate loading delay
  };

  return (
    <Box className="error-page">
      <Card className="error-card">
        <CardContent>
          <SentimentDissatisfiedIcon className="error-icon" />
          <Typography variant="h5" gutterBottom>
            Oops! No results found.
          </Typography>
          <Typography variant="body1" className="error-message">
            {errorMessage}
          </Typography>
          {loading ? (
            <CircularProgress color="primary" className="loading-spinner" />
          ) : (
            <Button variant="contained" color="primary" onClick={handleRetry}>
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorPage;
