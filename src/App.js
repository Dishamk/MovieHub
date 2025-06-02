
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/login/Login';
import Home from './components/home/Home';
import Movies from './components/pages/movies/Movies';
// import Details from './components/pages/Details';
import Details from './components/pages/details/Details';
import MyMovies from './components/pages/mymovies/MyMovies';
import Search from './components/pages/search/Search';
import ErrorPage from './components/pages/errorpage/ErrorPage';
import Logout from './components/pages/logout/Logout';
import Footer from './components/pages/footer/Footer';

const AppContent = ({ user, handleLogin, handleLogout }) => {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/logout'];

  return (
    <>
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:imdbID" element={<Details />} />
            <Route path="/mymovies" element={<MyMovies />} />
            <Route path="/search" element={<Search />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      <ToastContainer />

      {/* Conditionally render footer */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (email) => {
    setUser(email);
    localStorage.setItem('currentUser', email);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('myMovies');
  };

  return (
    <Router>
      <AppContent user={user} handleLogin={handleLogin} handleLogout={handleLogout} />
    </Router>
  );
};

export default App;
 

















