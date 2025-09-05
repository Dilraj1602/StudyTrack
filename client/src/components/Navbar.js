import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../api';
import ProfileDropdown from './ProfileDropdown';

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 6, verticalAlign: 'middle' }}>
    <path d="M13 15L18 10L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 10H7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 3V5C7 6.10457 7.89543 7 9 7H13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 17V15C7 13.8954 7.89543 13 9 13H13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const checkLogin = async () => {
    try {
      const res = await getCurrentUser();
      setIsLoggedIn(res.data.loggedIn);
      if (res.data.loggedIn && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkLogin();
    // eslint-disable-next-line
  }, [location.pathname]);

  const handleSignOut = async () => {
    await logout();
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    // Dispatch custom event for chat widget
    window.dispatchEvent(new Event('user-logged-out'));
    navigate('/');
    setTimeout(() => window.location.reload(), 100);
  };

  // Modern logout button style
  const logoutBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'linear-gradient(90deg, #2563eb 60%, #3b82f6 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '0.5rem 1.3rem',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
    transition: 'background 0.2s, box-shadow 0.2s',
    outline: 'none',
  };
  const logoutBtnHover = {
    background: 'linear-gradient(90deg, #1d4ed8 60%, #2563eb 100%)',
    boxShadow: '0 4px 16px rgba(37,99,235,0.18)',
  };
  const [hover, setHover] = useState(false);

  // Conditional rendering logic
  const isLanding = location.pathname === '/';
  const isDashboard = location.pathname === '/dashboard';

  // Smooth scroll handler for anchor links
  const handleSmoothScroll = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Not logged in: show only on landing page
  if (!isLoggedIn && !isLanding) return null;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 100,
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '0 2.5rem',
          borderRadius: '16px',
          background: '#fff',
          boxSizing: 'border-box',
        }}
      >
        <Link to="/" style={{
          fontWeight: 900,
          fontSize: '1.7rem',
          color: '#2563eb',
          letterSpacing: '1px',
          fontFamily: 'Segoe UI, Arial, sans-serif',
          textDecoration: 'none',
          textShadow: '0 2px 8px rgba(37,99,235,0.07)'
        }}>
          StudyTrack
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {/* Not logged in, on landing: Features, How it Works, Login/Sign Up */}
          {!isLoggedIn && isLanding && (
            <>
              <a href="#features" onClick={e => handleSmoothScroll(e, 'features')} style={{ color: '#222', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
              <a href="#testinomials" onClick={e => handleSmoothScroll(e, 'Testimonials')} style={{ color: '#222', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}>Testimonials</a>
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s', border: '1.5px solid #2563eb', borderRadius: 8, padding: '0.4rem 1.1rem', marginLeft: 8 }}>Login / Sign Up</Link>
            </>
          )}
          {/* Logged in: Dashboard, Leaderboard, and Profile */}
          {isLoggedIn && (
            <>
              {!isDashboard && (
                <Link to="/dashboard" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s', border: '1.5px solid #2563eb', borderRadius: 8, padding: '0.4rem 1.1rem' }}>Dashboard</Link>
              )}
              <Link to="/leaderboard" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s', border: '1.5px solid #2563eb', borderRadius: 8, padding: '0.4rem 1.1rem' }}>Leaderboard</Link>
              <Link to="/tracking" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s', border: '1.5px solid #2563eb', borderRadius: 8, padding: '0.4rem 1.1rem' }}>AI Insights</Link>
              <ProfileDropdown user={user} onLogout={handleSignOut} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
