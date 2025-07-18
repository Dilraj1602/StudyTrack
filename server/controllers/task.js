const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user }).sort({ date: -1 });
  res.json(tasks);
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