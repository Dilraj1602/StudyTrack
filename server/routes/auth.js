const express = require('express');
const { register, login, logout, getCurrentUser } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/current-user', getCurrentUser);

module.exports = router; 