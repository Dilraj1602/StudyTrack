import React, { useState } from 'react';
import './css/addedittask.css';
import { createTask } from '../api';

const AddEditTaskPage = () => {
  const [form, setForm] = useState({
    date: '',
    description: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        date: form.date,
        tasks: form.description.split('\n'),
        duration: form.duration
      };
      await createTask(payload);
      alert('Task added successfully!');
      setForm({ date: '', description: '', duration: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-edit-task-page">
      <form
        onSubmit={handleSubmit}
        className="add-edit-task-form"
      >
        <h2 className="form-title">Add Study Task</h2>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Task Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder={"1. Leetcode pod (1 Medium solved)\n2. GFG Pod (1 medium Solved 14 hard problem)\n3. BuyHatke OA"}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Total Duration (HH:MM:SS)</label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            pattern={"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"}
            placeholder="07:00:00"
            required
            className="form-input"
          />
        </div>
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default AddEditTaskPage; 