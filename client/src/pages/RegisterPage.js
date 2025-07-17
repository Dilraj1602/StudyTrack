import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      alert('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // Handle registration logic here
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

  const labelStyle = { fontSize: '0.97rem', color: '#333', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: 2 };
  const asterisk = <span style={{ color: '#dc2626', fontSize: '1.1em', marginLeft: 2 }}>*</span>;

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 420,
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
          Create your account
        </div>
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.2rem', margin: '0 0 0.2rem 0', color: '#222', letterSpacing: '0.2px' }}>Signup</h2>
        {/* Name fields row */}
        <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '0.2rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>First Name {asterisk}</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              style={inputStyle}
              autoComplete="given-name"
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Last Name {asterisk}</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              style={inputStyle}
              autoComplete="family-name"
            />
          </div>
        </div>
        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={labelStyle}>Email {asterisk}</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
            autoComplete="email"
          />
        </div>
        {/* Password fields row */}
        <div style={{ display: 'flex', gap: '0.7rem', marginBottom: '0.2rem' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Password {asterisk}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={inputStyle}
                autoComplete="new-password"
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
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Confirm Password {asterisk}</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                style={inputStyle}
                autoComplete="new-password"
              />
              <span
                onClick={() => setShowConfirmPassword(s => !s)}
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
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
        </div>
        {/* Age */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={labelStyle}>Age <span style={{ color: '#888', fontSize: '0.95em' }}>(optional)</span></label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            min="0"
            style={inputStyle}
            autoComplete="off"
          />
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
          Signup
        </button>
        <div style={{ textAlign: 'center', fontSize: '0.97rem', marginTop: '0.2rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#1e3a8a'} onMouseOut={e => e.target.style.color = '#2563eb'}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage; 