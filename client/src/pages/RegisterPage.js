import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/register.css';
import { register } from '../api';

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

  const handleSubmit = async e => {
    e.preventDefault();
    // Log the form data for debugging
    console.log('Form data:', form);
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      alert('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      // Send the correct fields to the backend
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      };
      await register(payload);
      alert('Registration successful! Please log in.');
      window.location.href = '/login';
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page-container">
      <form
        onSubmit={handleSubmit}
        className="register-form"
      >
        <div className="form-header">
          Create your account
        </div>
        <h2 className="form-title">Signup</h2>
        {/* Name fields row */}
        <div className="name-fields-row">
          <div className="form-group">
            <label className="form-label">First Name <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              className="form-input"
              autoComplete="given-name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name <span className="required-asterisk">*</span></label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              className="form-input"
              autoComplete="family-name"
            />
          </div>
        </div>
        {/* Email */}
        <div className="form-group">
          <label className="form-label">Email <span className="required-asterisk">*</span></label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="form-input"
            autoComplete="email"
          />
        </div>
        {/* Password fields row */}
        <div className="password-fields-row">
          <div className="form-group">
            <label className="form-label">Password <span className="required-asterisk">*</span></label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="form-input"
                autoComplete="new-password"
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
          <div className="form-group">
            <label className="form-label">Confirm Password <span className="required-asterisk">*</span></label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                autoComplete="new-password"
              />
              <span
                onClick={() => setShowConfirmPassword(s => !s)}
                className="password-toggle-icon"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
        </div>
        {/* Age */}
        <div className="form-group">
          <label className="form-label">Age <span className="optional-text">(optional)</span></label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            min="0"
            className="form-input"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="submit-button"
        >
          Signup
        </button>
        <div className="login-link-container">
          Already have an account?{' '}
          <Link to="/login" className="login-link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage; 