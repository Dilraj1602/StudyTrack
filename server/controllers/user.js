const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Leaderboard: Get all users ranked by total duration (all time)
const Task = require('../models/Task');

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
    // console.log('Leaderboard data:', leaderboard);
    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}; 