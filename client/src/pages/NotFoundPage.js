import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => (
  <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
    <motion.h1
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ fontSize: '5rem', fontWeight: 900, color: '#2563eb', marginBottom: '0.5rem', letterSpacing: '2px' }}
    >
      404
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{ fontSize: '1.3rem', color: '#333', marginBottom: '2rem' }}
    >
      Oops! The page you are looking for does not exist.<br />
      Let's get you back to safety.
    </motion.p>
    <Link to="/">
      <button
        style={{
          padding: '0.7rem 2.2rem',
          fontSize: '1rem',
          borderRadius: '6px',
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
          letterSpacing: '0.5px',
        }}
      >
        Go Home
      </button>
    </Link>
  </div>
);

export default NotFoundPage; 