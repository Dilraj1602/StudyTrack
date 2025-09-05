const express = require('express');
const { getTrackingInsights, getStudyStats } = require('../controllers/tracking');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/v1/tracking/insights
 * @desc    Get AI-powered study insights and analysis
 * @access  Private (Authenticated users only)
 * @returns {Object} AI-generated insights across 6 categories:
 *   - performanceOverview: Study hours, consistency, progress trends
 *   - strengthsWeaknesses: Subject-specific strengths and areas for improvement
 *   - productivityInsights: Peak hours, study patterns, distractions
 *   - learningEfficiency: Retention, revision effectiveness, task completion
 *   - aiFeedback: Personalized recommendations and study strategies
 *   - competitiveBenchmarking: Ranking and path to top 1%
 * 
 * @example Response:
 * {
 *   "message": "AI insights generated successfully",
 *   "insights": { ... },
 *   "hasData": true,
 *   "dataSummary": {
 *     "totalTasks": 15,
 *     "completedTasks": 12,
 *     "totalStudyTime": 8,
 *     "lastActivity": "2024-01-15T10:30:00Z"
 *   }
 * }
 */
router.get('/insights', auth, getTrackingInsights);

/**
 * @route   GET /api/v1/tracking/stats
 * @desc    Get comprehensive study statistics and metrics
 * @access  Private (Authenticated users only)
 * @returns {Object} Study performance statistics:
 *   - totalTasks: Total number of study tasks created
 *   - completedTasks: Number of completed tasks
 *   - pendingTasks: Number of pending/incomplete tasks
 *   - completionRate: Percentage of tasks completed
 *   - averageTaskDuration: Average time per task
 *   - studyStreak: Consecutive days with study activity
 *   - monthlyProgress: Current month's study performance
 * 
 * @example Response:
 * {
 *   "totalTasks": 15,
 *   "completedTasks": 12,
 *   "pendingTasks": 3,
 *   "completionRate": 80,
 *   "averageTaskDuration": 2,
 *   "studyStreak": 5,
 *   "monthlyProgress": {
 *     "month": "January",
 *     "totalTasks": 8,
 *     "completedTasks": 6,
 *     "completionRate": 75
 *   }
 * }
 */
router.get('/stats', auth, getStudyStats);

module.exports = router;
