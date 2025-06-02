// import React, { useState, useEffect } from 'react';
// import {
//   AppBar, Toolbar, Typography, Button, TextField,
//   InputAdornment, IconButton, Box
// } from '@mui/material';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import ClearIcon from '@mui/icons-material/Clear';
// import './Header.css';

// const Header = ({ query, setQuery, onSearch }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [showSearchBox, setShowSearchBox] = useState(location.pathname === '/search');

//   useEffect(() => {
//     setShowSearchBox(location.pathname === '/search');
//   }, [location.pathname]);

//   const handleSearchClick = () => {
//     navigate('/search');
//     setShowSearchBox(true);
//   };

//   const handleClear = () => {
//     setQuery('');
//   };

//   return (
//     <AppBar
//       position="fixed"
//       className="app-bar"
//       sx={{ minHeight: '56px' }} 
//     >
//       <Toolbar
//         className="toolbar"
//         sx={{ minHeight: '56px', paddingY: '4px' }} 
//       >
//         <Typography
//           variant="h6"
//           className="title"
//           onClick={() => navigate('/')}
//           style={{ cursor: 'pointer' }}
//         >
//           MovieHub
//         </Typography>

//         <Box className="nav-buttons">
//           <Button color="inherit" component={Link} to="/movies">Movies</Button>

//           <Box className="search-button-group">
//             <Button color="inherit" onClick={handleSearchClick}>Search</Button>
//             {showSearchBox && (
//               <TextField
//                 size="small"
//                 placeholder="Search movies..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && onSearch()}
//                 className="header-search-box"
//                 InputProps={{
//                   endAdornment: query && (
//                     <InputAdornment position="end">
//                       <IconButton onClick={handleClear} sx={{ color: '#f44336' }}>
//                         <ClearIcon />
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             )}
//           </Box>

//           <Button color="inherit" component={Link} to="/mymovies">MyMovies</Button>
//           <Button color="inherit" onClick={() => navigate('/logout')}>Logout</Button>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;
















import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, TextField,
  InputAdornment, IconButton, Box, Drawer, List, ListItem, ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ query, setQuery, onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearchBox, setShowSearchBox] = useState(location.pathname === '/search');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setShowSearchBox(location.pathname === '/search');
  }, [location.pathname]);

  const handleSearchClick = () => {
    navigate('/search');
    setShowSearchBox(true);
  };

  const handleClear = () => {
    setQuery('');
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box className="drawer-content" role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem button component={Link} to="/movies">
          <ListItemText primary="Movies" />
        </ListItem>
        <ListItem button onClick={handleSearchClick}>
          <ListItemText primary="Search" />
        </ListItem>
        {showSearchBox && (
          <ListItem>
            <TextField
              size="small"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              className="header-search-box"
              InputProps={{
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClear} sx={{ color: '#f44336' }}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        )}
        <ListItem button component={Link} to="/mymovies">
          <ListItemText primary="MyMovies" />
        </ListItem>
        <ListItem button onClick={() => navigate('/logout')}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" className="app-bar" sx={{ minHeight: '56px' }}>
      <Toolbar className="toolbar" sx={{ minHeight: '56px', paddingY: '4px' }}>
        <Typography
          variant="h6"
          className="title"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          MovieHub
        </Typography>

        <Box className="hamburger-menu">
          <IconButton edge="end" color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </Box>

        <Box className="nav-buttons">
          <Button color="inherit" component={Link} to="/movies">Movies</Button>

          <Box className="search-button-group">
            <Button color="inherit" onClick={handleSearchClick}>Search</Button>
            {showSearchBox && (
              <TextField
                size="small"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                className="header-search-box"
                InputProps={{
                  endAdornment: query && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClear} sx={{ color: '#f44336' }}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>

          <Button color="inherit" component={Link} to="/mymovies">MyMovies</Button>
          <Button color="inherit" onClick={() => navigate('/logout')}>Logout</Button>
        </Box>
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Header;
