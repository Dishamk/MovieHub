import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Link, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validatePassword = (pwd) => {
    return pwd.length >= 6 && /[A-Z]/.test(pwd) && /\d/.test(pwd);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters, include a number and an uppercase letter.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (isSignup) {
      if (users[email]) {
        setError('User already exists. Please login.');
        return;
      }
      users[email] = password;
      localStorage.setItem('users', JSON.stringify(users));
    } else {
      if (!users[email] || users[email] !== password) {
        setError('Invalid email or password.');
        return;
      }
    }

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    setError('');
    onLogin(email);
    localStorage.setItem('currentUser', email);

    const userMovies = JSON.parse(localStorage.getItem(`mymovies_${email}`)) || [];
    localStorage.setItem('myMovies', JSON.stringify(userMovies));

    navigate('/');
  };

  return (
    <Box className="login-container">
      <Typography variant="h4">{isSignup ? 'Sign Up' : 'Login'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
            />
          }
          label="Remember Me"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isSignup ? 'Sign Up' : 'Login'}
        </Button>
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Link href="#" onClick={() => {
            setIsSignup(!isSignup);
            setError('');
          }}>
            {isSignup ? 'Login' : 'Sign Up'}
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default Login;






// import React, { useState } from 'react';
// import { TextField, Button, Typography, Box, Link } from '@mui/material';
// import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
// import './Login.css';

// const Login = ({ onLogin }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate(); // ✅ Initialize navigate

//   const validatePassword = (pwd) => {
//     return pwd.length >= 6 && /[A-Z]/.test(pwd) && /\d/.test(pwd);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validatePassword(password)) {
//       setError('Password must be at least 6 characters, include a number and an uppercase letter.');
//       return;
//     }
//     setError('');
//     onLogin(email); // ✅ Set user
//     navigate('/');  // ✅ Redirect to Home after login
//   };

//   return (
//     <Box className="login-container">
//       <Typography variant="h4">{isSignup ? 'Sign Up' : 'Login'}</Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Email"
//           type="email"
//           fullWidth
//           required
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <TextField
//           label="Password"
//           type="password"
//           fullWidth
//           required
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         {error && <Typography color="error">{error}</Typography>}
//         <Button type="submit" variant="contained" color="primary" fullWidth>
//           {isSignup ? 'Sign Up' : 'Login'}
//         </Button>
//         <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
//           {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
//           <Link href="#" onClick={() => setIsSignup(!isSignup)}>
//             {isSignup ? 'Login' : 'Sign Up'}
//           </Link>
//         </Typography>
//       </form>
//     </Box>
//   );
// };

// export default Login;




