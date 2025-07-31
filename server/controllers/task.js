const Task = require('../models/Task');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

exports.taskValidation = [
  body('date').notEmpty().withMessage('Date is required'),
  body('tasks').isArray({ min: 1 }).withMessage('At least one task is required'),
  body('duration').matches(/^\d{2}:\d{2}:\d{2}$/).withMessage('Duration must be in HH:MM:SS format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort({ date: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};





exports.getMonthlyStats = async (req, res) => {
  try {
    const { year } = req.params;
    
    if (!year || !/^\d{4}$/.test(year)) {
      return res.status(400).json({ message: 'Valid year required (YYYY format)' });
    }

    const monthlyStats = await Task.aggregate([
      {
        $match: {
          user: req.user,
          date: { $regex: `^${year}-` } 
        }
      },
      {
        $addFields: {
          month: { $substr: ['$date', 5, 2] } 
        }
      },
      {
        $group: {
          _id: '$month',
          dayCount: { $sum: 1 },
          durations: { $push: '$duration' }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // console.log('Monthly stats aggregation result:', monthlyStats);

    // Convert to array with all months (1-12) and calculate averages
    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, '0');
      const monthData = monthlyStats.find(stat => stat._id === monthStr);
      
      if (monthData) {
        // Calculate average duration in hours
        const totalSeconds = monthData.durations.reduce((acc, duration) => {
          const [h, m, s] = duration.split(':').map(Number);
          return acc + h * 3600 + m * 60 + s;
        }, 0);
        
        const avgHours = totalSeconds / monthData.dayCount / 3600;
        monthlyData.push({
          month: month,
          monthName: new Date(2000, month - 1).toLocaleString('default', { month: 'short' }),
          avgHours: Math.round(avgHours * 100) / 100, // Round to 2 decimal places
          dayCount: monthData.dayCount
        });
      } else {
        monthlyData.push({
          month: month,
          monthName: new Date(2000, month - 1).toLocaleString('default', { month: 'short' }),
          avgHours: 0,
          dayCount: 0
        });
      }
    }
    res.json(monthlyData);
  } catch (error) {
    console.error('Error getting monthly stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { date, tasks, duration } = req.body;
    if (!date || !tasks || !duration) return res.status(400).json({ message: 'All fields required' });
    const task = await Task.create({ date, tasks, duration, user: req.user });
    // Add the task reference to the user's tasks array
    await User.findByIdAndUpdate(req.user, { $push: { tasks: task._id } });
    res.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { date, tasks, duration } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { date, tasks, duration },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 