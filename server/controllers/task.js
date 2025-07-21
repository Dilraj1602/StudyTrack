const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user }).sort({ date: -1 });
  res.json(tasks);
};





exports.getMonthlyStats = async (req, res) => {
  try {
    const { year } = req.params;
    
    // console.log('Getting monthly stats for year:', year, 'user:', req.user);
    
    // Validate year parameter
    if (!year || !/^\d{4}$/.test(year)) {
      return res.status(400).json({ message: 'Valid year required (YYYY format)' });
    }

    // Aggregate data by month for the specified year
    const monthlyStats = await Task.aggregate([
      {
        $match: {
          user: req.user,
          date: { $regex: `^${year}-` } // Match dates starting with the year
        }
      },
      {
        $addFields: {
          month: { $substr: ['$date', 5, 2] } // Extract month (MM) from YYYY-MM-DD
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

    // console.log('Final monthly data:', monthlyData);
    res.json(monthlyData);
  } catch (error) {
    console.error('Error getting monthly stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createTask = async (req, res) => {
  const { date, tasks, duration } = req.body;
  if (!date || !tasks || !duration) return res.status(400).json({ message: 'All fields required' });
  const task = await Task.create({ date, tasks, duration, user: req.user });
  res.json(task);
};

exports.updateTask = async (req, res) => {
  const { date, tasks, duration } = req.body;
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user },
    { date, tasks, duration },
    { new: true }
  );
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
}; 