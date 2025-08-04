import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, verifyResetCode } from '../api';
import './css/login.css';

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
      // Verify OTP without updating password
      await verifyOtp({
        email,
        code: otp
      });
      
      // If verification succeeds, move to password reset step
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
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: message.includes('sent') ? '#d1fae5' : '#fee2e2',
          color: message.includes('sent') ? '#065f46' : '#dc2626',
          border: `1px solid ${message.includes('sent') ? '#a7f3d0' : '#fecaca'}`
        }}>
          {message}
        </div>
      )}
      
      <button
        type="submit"
        className="login-button"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Verification Code'}
      </button>
      
      <div className="link-container">
        <Link
          to="/login"
          className="link-text"
          style={{ textDecoration: 'none' }}
        >
          Back to Login
        </Link>
      </div>
    </form>
  );

  // Render Step 2: OTP Verification
  const renderOtpStep = () => (
    <div>
      <div style={{
        padding: '20px',
        marginBottom: '24px',
        borderRadius: '12px',
        backgroundColor: '#d1fae5',
        border: '1px solid #a7f3d0',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
        <h3 style={{ color: '#065f46', margin: '0 0 8px 0', fontSize: '18px' }}>
          Check Your Email
        </h3>
        <p style={{ color: '#065f46', margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
          We've sent a verification code to<br />
          <strong>{email}</strong>
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
            className="form-input"
            placeholder="Enter 6-digit code"
            maxLength="6"
            pattern="[0-9]{6}"
            title="Please enter a 6-digit verification code"
          />
          <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
            Enter the 6-digit code sent to {email}
          </small>
        </div>
        
        {message && (
          <div style={{
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: message.includes('successful') ? '#d1fae5' : '#fee2e2',
            color: message.includes('successful') ? '#065f46' : '#dc2626',
            border: `1px solid ${message.includes('successful') ? '#a7f3d0' : '#fecaca'}`
          }}>
            {message}
          </div>
        )}
        
        <button
          type="submit"
          className="login-button"
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
            className="link-text"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Use Different Email
          </button>
          <Link
            to="/login"
            className="link-text"
            style={{ textDecoration: 'none' }}
          >
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
            placeholder="Enter new password"
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
      
      <button
        type="submit"
        className="login-button"
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
          className="link-text"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Back to Verification
        </button>
        <Link
          to="/login"
          className="link-text"
          style={{ textDecoration: 'none' }}
        >
          Back to Login
        </Link>
      </div>
    </form>
  );

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-title">
          Reset your<br />password
        </div>
        <h2 className="login-heading">
          {currentStep === 1 && 'Forgot Password'}
          {currentStep === 2 && 'Verify Code'}
          {currentStep === 3 && 'Reset Password'}
        </h2>
        
        {currentStep === 1 && renderEmailStep()}
        {currentStep === 2 && renderOtpStep()}
        {currentStep === 3 && renderPasswordStep()}
      </div>
    </div>
  );
};

export default ResetPasswordPage; 