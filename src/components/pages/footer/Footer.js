import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      © {new Date().getFullYear()} Your Company. All rights reserved.
    </footer>
  );
};

export default Footer;


