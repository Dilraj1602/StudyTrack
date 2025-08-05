import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, verifyResetCode } from '../api';
import './css/reset-password.css';

const ResetPasswordPage = () => {
  // Step states
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  
  // Form data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  // Step 1: Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    // Simple email validation
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setMessage('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await forgotPassword({ email });
      setCurrentStep(2);
      setMessage('A verification code has been sent to your email address.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      setMessage('Please enter the verification code');
      return;
    }

    if (otp.length !== 6) {
      setMessage('Verification code must be 6 digits');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await verifyOtp({
        email,
        code: otp
      });
      
      setCurrentStep(3);
      setMessage('Verification successful! Please enter your new password.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle password reset
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (newPassword.length < 4) {
      setMessage('New password must be at least 4 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await verifyResetCode({
        email,
        code: otp,
        newPassword: newPassword
      });
      
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Password reset successfully! You can now login with your new password.' }
        });
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : 'inactive'}`}>
        <div className="step-number">1</div>
        <span>Email</span>
      </div>
      <div className={`step ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : 'inactive'}`}>
        <div className="step-number">{currentStep > 2 ? '✓' : '2'}</div>
        <span>Verify</span>
      </div>
      <div className={`step ${currentStep >= 3 ? 'active' : 'inactive'}`}>
        <div className="step-number">3</div>
        <span>Reset</span>
      </div>
    </div>
  );

  // Message component
  const Message = ({ type = 'info', children }) => (
    <div className={`message ${type}`}>
      {type === 'success' && '✅'}
      {type === 'error' && '❌'}
      {type === 'info' && 'ℹ️'}
      {children}
    </div>
  );

  // Render Step 1: Email Input
  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit}>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
          placeholder="Enter your registered email address"
          autoComplete="email"
        />
      </div>
      
      {message && (
        <Message type={message.includes('sent') ? 'success' : 'error'}>
          {message}
        </Message>
      )}
      
      <button
        type="submit"
        className="reset-button"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Verification Code'}
      </button>
      
      <div className="link-container">
        <Link to="/login" className="link-text">
          ← Back to Login
        </Link>
      </div>
    </form>
  );

  // Render Step 2: OTP Verification
  const renderOtpStep = () => (
    <div>
      <div className="email-info-box">
        <span className="email-icon">📧</span>
        <h3 className="email-title">Check Your Email</h3>
        <p className="email-subtitle">
          We've sent a verification code to<br />
          <span className="email-address">{email}</span>
        </p>
      </div>

      <form onSubmit={handleOtpSubmit}>
        <div className="form-group">
          <label className="form-label">Verification Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="form-input otp-input"
            placeholder="000000"
            maxLength="6"
            pattern="[0-9]{6}"
            title="Please enter a 6-digit verification code"
          />
          <span className="otp-hint">
            Enter the 6-digit code sent to {email}
          </span>
        </div>
        
        {message && (
          <Message type={message.includes('successful') ? 'success' : 'error'}>
            {message}
          </Message>
        )}
        
        <button
          type="submit"
          className="reset-button"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
        
        <div className="link-container">
          <button
            onClick={() => {
              setCurrentStep(1);
              setMessage('');
              setOtp('');
            }}
            className="back-button"
          >
            ← Use Different Email
          </button>
          <Link to="/login" className="link-text">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );

  // Render Step 3: Password Reset
  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit}>
      <div className="form-group">
        <label className="form-label">New Password</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="form-input"
            placeholder="Enter new password (min 4 characters)"
            minLength="4"
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
        <label className="form-label">Confirm New Password</label>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="form-input"
            placeholder="Confirm new password"
            minLength="4"
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
      
      {message && (
        <Message type={message.includes('successfully') ? 'success' : 'error'}>
          {message}
        </Message>
      )}
      
      <button
        type="submit"
        className="reset-button"
        disabled={loading}
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
      
      <div className="link-container">
        <button
          onClick={() => {
            setCurrentStep(2);
            setMessage('');
            setNewPassword('');
            setConfirmPassword('');
          }}
          className="back-button"
        >
          ← Back to Verification
        </button>
        <Link to="/login" className="link-text">
          Back to Login
        </Link>
      </div>
    </form>
  );

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <div className="reset-password-title">
          Reset your<br />password
        </div>
        <h2 className="reset-password-heading">
          {currentStep === 1 && 'Enter your email address'}
          {currentStep === 2 && 'Verify your email'}
          {currentStep === 3 && 'Create new password'}
        </h2>
        
        <StepIndicator />
        
        {currentStep === 1 && renderEmailStep()}
        {currentStep === 2 && renderOtpStep()}
        {currentStep === 3 && renderPasswordStep()}
      </div>
    </div>
  );
};

export default ResetPasswordPage; 
