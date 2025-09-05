import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './css/notfound.css';

const NotFoundPage = () => (
  <div className="not-found-container">
    <motion.h1
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="not-found-title"
    >
      404
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="not-found-message"
    >
      Oops! The page you are looking for does not exist.<br />
      Let's get you back to safety.
    </motion.p>
    <Link to="/">
      <button
        className="not-found-button"
      >
        Go Home
      </button>
    </Link>
  </div>
);

export default NotFoundPage; 