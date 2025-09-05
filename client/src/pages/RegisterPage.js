import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/register.css';
import { sendSignupOtp, verifySignupOtp, register } from '../api';

const RegisterPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Registration
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    age: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await sendSignupOtp({ email });
      setTempUserId(response.data.tempUserId);
      setMessage('Verification code sent to your email!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await verifySignupOtp({ email, otp, tempUserId });
      setMessage('Email verified successfully! Please complete your registration.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateRegistration = () => {
    if (!form.firstName || !form.lastName || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegistration()) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email,
        password: form.password,
        tempUserId
      };
      await register(payload);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await sendSignupOtp({ email });
      setTempUserId(response.data.tempUserId);
      setMessage('New verification code sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp('');
      setTempUserId('');
    } else if (step === 3) {
      setStep(2);
      setForm({
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        age: '',
      });
    }
    setError('');
    setMessage('');
  };

  // Step 1: Email Input
  if (step === 1) {
    return (
      <div className="register-page-container">
        <form onSubmit={handleEmailSubmit} className="register-form">
          <div className="form-header">
            Create your account
          </div>
          <h2 className="form-title">Step 1: Verify Email</h2>
          
          <div className="form-group">
            <label className="form-label">Email Address <span className="required-asterisk">*</span></label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              autoComplete="email"
              placeholder="Enter your email address"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
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
  }

  // Step 2: OTP Verification
  if (step === 2) {
    return (
      <div className="register-page-container">
        <form onSubmit={handleOtpSubmit} className="register-form">
          <div className="form-header">
            Create your account
          </div>
          <h2 className="form-title">Step 2: Verify Code</h2>
          
          <div className="form-group">
            <label className="form-label">Verification Code <span className="required-asterisk">*</span></label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              className="form-input"
              placeholder="Enter 6-digit code"
              maxLength="6"
            />
            <small className="form-help-text">
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </small>
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="form-actions">
            <button
              type="button"
              onClick={resendOtp}
              className="secondary-button"
              disabled={loading}
            >
              Resend Code
            </button>
            <button
              type="button"
              onClick={goBack}
              className="secondary-button"
              disabled={loading}
            >
              Back
            </button>
          </div>

          <div className="login-link-container">
            Already have an account?{' '}
            <Link to="/login" className="login-link">
              Login
            </Link>
          </div>
        </form>
      </div>
    );
  }

  // Step 3: Complete Registration
  return (
    <div className="register-page-container">
      <form onSubmit={handleRegistrationSubmit} className="register-form">
        <div className="form-header">
          Create your account
        </div>
        <h2 className="form-title">Step 3: Complete Registration</h2>
        
        <div className="form-group">
          <small className="form-help-text success-text">
            ✓ Email verified: <strong>{email}</strong>
          </small>
        </div>

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

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="form-actions">
          <button
            type="button"
            onClick={goBack}
            className="secondary-button"
            disabled={loading}
          >
            Back
          </button>
        </div>

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