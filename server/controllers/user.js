const User = require('../models/User');
const Task = require('../models/Task');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) return res.status(400).json({ message: 'First and last name required' });
    const user = await User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName tasks');
    const leaderboard = [];
    for (const user of users) {
      const tasks = await Task.find({ _id: { $in: user.tasks } });
      let totalSeconds = 0;
      for (const task of tasks) {
        const [h, m, s] = task.duration.split(':').map(Number);
        totalSeconds += h * 3600 + m * 60 + s;
      }
      leaderboard.push({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        totalDuration: totalSeconds
      });
    }
    leaderboard.sort((a, b) => b.totalDuration - a.totalDuration);
    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // ... update logic ...
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 