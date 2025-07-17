import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
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
        <Link to="/login" style={{ color: '#222', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#2563eb'} onMouseOut={e => e.target.style.color = '#222'}>
          Login
        </Link>
        <Link to="/register" style={{ color: '#222', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#2563eb'} onMouseOut={e => e.target.style.color = '#222'}>
          Signup
        </Link>
        <Link to="/dashboard" style={{ color: '#222', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#2563eb'} onMouseOut={e => e.target.style.color = '#222'}>
          Dashboard
        </Link>
        <Link to="/random404" style={{ color: '#b91c1c', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s', marginLeft: '1.5rem', padding: '0.3rem 1rem', borderRadius: '8px', background: '#fef2f2' }} onMouseOver={e => e.target.style.color = '#ef4444'} onMouseOut={e => e.target.style.color = '#b91c1c'}>
          Error
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
