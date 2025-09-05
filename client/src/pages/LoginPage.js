import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/login.css';
import { login } from '../api';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [hovered, setHovered] = useState({ signup: false, forgot: false });
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      // Clear the state to prevent showing the message again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        // console.log('LoginPage - Checking login status, token found:', !!token);
        if (token) {
          const config = { withCredentials: true, headers: { Authorization: `Bearer ${token}` } };
          const res = await axios.get(`${API_URL}/auth/current-user`, config);
          // console.log('LoginPage - Auth response:', res.data);
          if (res.data.loggedIn) {
            // console.log('LoginPage - User is logged in, redirecting to dashboard');
            navigate('/dashboard');
                  } else {
          // console.log('LoginPage - User is not logged in, showing login form');
        }
      } else {
        // console.log('LoginPage - No token found, showing login form');
      }
    } catch (error) {
      // If there's an error, user is not logged in, continue with login form
      // console.log('LoginPage - Error checking login status:', error.message);
    }
    };

    checkLoginStatus();
  }, [navigate]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.email || !form.password) {
      alert('Please fill in all fields.');
      return false;
    }
    // Simple email regex
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      alert('Please enter a valid email.');
      return false;
    }
    if (form.password.length < 4) {
      alert('Password must be at least 4 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await login(form);
      // console.log('Login response:', response);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        // console.log('Token stored, redirecting...');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="login-container">
      <form
        onSubmit={handleSubmit}
        className="login-form"
      >
        <div className="login-title">
          Hey user,<br />welcome back
        </div>
        <h2 className="login-heading">Login</h2>
        
        {message && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: message.includes('successfully') ? '#d1fae5' : '#fee2e2',
            color: message.includes('successfully') ? '#065f46' : '#dc2626',
            border: `1px solid ${message.includes('successfully') ? '#a7f3d0' : '#fecaca'}`
          }}>
            {message}
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="password-input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="form-input"
            />
            <span
              onClick={() => setShowPassword(s => !s)}
              className="password-toggle-icon"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="link-container">
          <Link
            to="/reset-password"
            className={`link-text ${hovered.forgot ? 'link-underline' : ''}`}
            onMouseEnter={() => setHovered(h => ({ ...h, forgot: true }))}
            onMouseLeave={() => setHovered(h => ({ ...h, forgot: false }))}
          >
            Forgot password?
          </Link>
          <Link
            to="/register"
            className={`link-text ${hovered.signup ? 'link-underline' : ''}`}
            onMouseEnter={() => setHovered(h => ({ ...h, signup: true }))}
            onMouseLeave={() => setHovered(h => ({ ...h, signup: false }))}
          >
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 