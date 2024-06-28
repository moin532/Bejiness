import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light ${scrolled ? 'bg-white nav-bor' : 'bg-transparent1'} fixed-top`}
      style={{ transition: 'background 0.3s, color 0.3s' }}
    >
      <div className="container" style={{ maxWidth: '1100px' }}>
        <Link
          className={`navbar-brand ${scrolled ? 'text-dark font-weight-bold' : 'text-white font-weight-bold'}`}
          to="/"
        >
          <img
            src="/home/bejiness-logo.png"
            width="40"
            height="40"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
          onClick={toggleMobileMenu}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse justify-content-end ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                className={`nav-link ${scrolled ? 'text-dark font-weight-bold' : 'text-white font-weight-bold mob-noscroll'}`}
                to="/blogs"
              >
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${scrolled ? 'text-dark font-weight-bold' : 'text-white font-weight-bold mob-noscroll'}`}
                to="/login"
              >
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${scrolled ? 'text-dark font-weight-bold' : 'text-white font-weight-bold mob-noscroll'}`}
                to="/signup"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
