const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, getMonthlyStats } = require('../controllers/task');
const { getLeaderboard } = require('../controllers/user');
const { taskValidation } = require('../controllers/task');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/leaderboard', getLeaderboard);

router.get('/', auth, getTasks);
router.get('/monthly-stats/:year', auth, getMonthlyStats);
router.post('/', auth, taskValidation, createTask);
router.put('/:id', auth, taskValidation, updateTask);
router.delete('/:id', auth, deleteTask);

module.exports = router; 