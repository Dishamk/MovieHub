import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { toast } from 'react-toastify';
import './Logout.css';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleCancel = () => {
    navigate('/');
  };

  const handleConfirm = () => {
    // Show toast
    toast.success('You have been logged out successfully!', {
      position: 'top-center',
      autoClose: 2000,
      theme: 'colored',
    });

    // Show message on screen
    setMessage('You have been successfully logged out.');

    // Delay logout and navigation
    setTimeout(() => {
      sessionStorage.clear();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('myMovies');

      onLogout(); // Update app state
      navigate('/login', { replace: true });
    }, 2200);
  };

  return (
    <Box className="logout-page">
      <Card className="logout-card">
        <CardContent>
          {message ? (
            <Typography variant="h6" color="success.main">
              {message}
            </Typography>
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Are you sure you want to logout?
              </Typography>
              <Box className="logout-buttons">
                <Button variant="outlined" color="primary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirm}>
                  OK
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Logout;
















// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Card, CardContent, Typography, Button } from '@mui/material';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './Logout.css';

// const Logout = ({ onLogout }) => {
//   const navigate = useNavigate();

//   const handleCancel = () => {
//     navigate('/'); // Go to Home page
//   };

//   const handleConfirm = () => {
//     localStorage.clear();
//     sessionStorage.clear();
//     onLogout(); // Clear user state in App

//     toast.success('You have been logged out successfully!', {
//       position: 'top-center',
//       autoClose: 2000,
//     });

//     setTimeout(() => {
//       navigate('/login', { replace: true }); // Go to Login page
//     }, 2000);
//   };

//   return (
//     <Box className="logout-page">
//       <Card className="logout-card">
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Are you sure you want to logout?
//           </Typography>
//           <Box className="logout-buttons">
//             <Button variant="outlined" color="primary" onClick={handleCancel}>
//               Cancel
//             </Button>
//             <Button variant="contained" color="error" onClick={handleConfirm}>
//               OK
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//       <ToastContainer />
//     </Box>
//   );
// };

// export default Logout;





// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Box, Card, CardContent, Typography, Button } from '@mui/material';
// import { toast } from 'react-toastify';
// import './Logout.css';

// const Logout = ({ onLogout }) => {
//   const navigate = useNavigate();

//   const handleCancel = () => {
//     navigate('/'); // Go to Home page
//   };

//   const handleConfirm = () => {
//     // Show toast with progress bar
//     toast.success('✅ You have been successfully logged out!', {
//       position: 'top-center',
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: false,
//       draggable: false,
//       progress: undefined,
//       theme: 'colored',
//     });

//     // Delay logout and navigation
//     setTimeout(() => {
//       sessionStorage.clear();
//       localStorage.removeItem('currentUser');
//       localStorage.removeItem('myMovies');

//       onLogout(); // Update app state
//       navigate('/login', { replace: true });
//     }, 3200); // Slightly longer than autoClose
//   };

//   return (
//     <Box className="logout-page">
//       <Card className="logout-card">
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Are you sure you want to logout?
//           </Typography>
//           <Box className="logout-buttons">
//             <Button variant="outlined" color="primary" onClick={handleCancel}>
//               Cancel
//             </Button>
//             <Button variant="contained" color="error" onClick={handleConfirm}>
//               OK
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };

// export default Logout;
