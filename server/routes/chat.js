const express = require('express');
const { chatWithBot } = require('../controllers/chat');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

// Accepts both authenticated and unauthenticated users
router.post('/', optionalAuth, chatWithBot);

module.exports = router; 