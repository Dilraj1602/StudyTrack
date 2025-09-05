const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  date: { type: String, required: true },
  tasks: { type: [String], required: true }, 
  duration: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Task', taskSchema); 