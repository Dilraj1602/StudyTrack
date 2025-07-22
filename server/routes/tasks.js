const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, getMonthlyStats } = require('../controllers/task');
const { getLeaderboard } = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();

// Place leaderboard route at the top to avoid conflict with parameterized routes
router.get('/leaderboard', getLeaderboard);


router.get('/', auth, getTasks);
router.get('/monthly-stats/:year', auth, getMonthlyStats);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router; 