const express = require('express');
const { register, login, logout, getCurrentUser, changePassword, forgotPassword, verifyOtp, verifyResetCode, sendSignupOtp, verifySignupOtp } = require('../controllers/auth');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: { message: 'Too many requests, please try again later.' }
});

// Validation middlewares
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/logout', logout);
router.get('/current-user', getCurrentUser);

// Password management routes
router.post('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 4 }).withMessage('New password must be at least 4 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
], changePassword);

router.post('/forgot-password', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
], forgotPassword);

router.post('/verify-otp', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').notEmpty().withMessage('Verification code is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
], verifyOtp);

router.post('/verify-reset-code', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').notEmpty().withMessage('Verification code is required'),
  body('newPassword').isLength({ min: 4 }).withMessage('New password must be at least 4 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
], verifyResetCode);

// New signup OTP routes
router.post('/send-signup-otp', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
], sendSignupOtp);

router.post('/verify-signup-otp', authLimiter, [
  body('email').isEmail().withMessage('Valid email is required'),
  body('otp').notEmpty().withMessage('Verification code is required'),
  body('tempUserId').notEmpty().withMessage('Temporary user ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
], verifySignupOtp);

// Add update profile route
router.put('/update-profile', auth, [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
], require('../controllers/user').updateProfile);

module.exports = router; 