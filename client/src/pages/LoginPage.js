import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [hovered, setHovered] = useState({ signup: false, forgot: false });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Handle login logic here
  };

  const inputStyle = {
    padding: '0.7rem',
    border: '1px solid #e0e7ef',
    borderRadius: 7,
    fontSize: '1rem',
    outline: 'none',
    background: '#fff',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 350,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{
          marginBottom: '0.2rem',
          color: '#1e3a8a',
          fontSize: '1.35rem',
          fontWeight: 700,
          textAlign: 'center',
          fontFamily: 'Arial, Helvetica, sans-serif',
          letterSpacing: '0.5px',
        }}>
          Hey user,<br />welcome back
        </div>
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.2rem', margin: '0 0 0.2rem 0', color: '#222', letterSpacing: '0.2px' }}>Login</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.97rem', color: '#333', fontWeight: 500 }}>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            style={inputStyle}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.97rem', color: '#333', fontWeight: 500 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              style={inputStyle}
            />
            <span
              onClick={() => setShowPassword(s => !s)}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: '#888',
                fontSize: '1.15rem',
                userSelect: 'none',
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>
        </div>
        <button
          type="submit"
          style={{
            marginTop: '0.5rem',
            padding: '0.7rem',
            borderRadius: 7,
            border: 'none',
            background: '#222',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.05rem',
            cursor: 'pointer',
            letterSpacing: '0.5px',
          }}
        >
          Login
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.97rem', marginTop: '0.2rem' }}>
          <Link
            to="#"
            style={{
              color: hovered.forgot ? '#2563eb' : '#666',
              textDecoration: hovered.forgot ? 'underline' : 'underline',
              fontWeight: 500,
              transition: 'color 0.2s',
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHovered(h => ({ ...h, forgot: true }))}
            onMouseLeave={() => setHovered(h => ({ ...h, forgot: false }))}
          >
            Forgot password?
          </Link>
          <Link
            to="/register"
            style={{
              color: hovered.signup ? '#1e3a8a' : '#2563eb',
              fontWeight: 500,
              textDecoration: hovered.signup ? 'underline' : 'none',
              transition: 'color 0.2s',
              cursor: 'pointer',
            }}
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