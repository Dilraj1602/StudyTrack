import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <motion.div
    className="container"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    style={{ textAlign: 'center', marginTop: '7rem' }} // Ensures content is below navbar
  >
    <motion.h1
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 600 }}
    >
      Welcome to StudyTrack
    </motion.h1>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      style={{ fontSize: '1.2rem', marginBottom: '2.5rem', color: '#555' }}
    >
      Track your study progress daily, weekly, monthly, and more!
    </motion.p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
      <Link to="/login">
        <button style={{ padding: '0.7rem 2.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 500 }}>
          Login
        </button>
      </Link>
      <Link to="/register">
        <button style={{ padding: '0.7rem 2.2rem', fontSize: '1rem', borderRadius: '6px', border: 'none', background: '#e0e7ff', color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>
          Sign Up
        </button>
      </Link>
    </div>
  </motion.div>
);

export default LandingPage;
