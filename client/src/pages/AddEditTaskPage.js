import React, { useState } from 'react';

const AddEditTaskPage = () => {
  const [form, setForm] = useState({
    date: '',
    description: '',
    duration: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Handle add/edit logic here
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.1rem',
        }}
      >
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.3rem', marginBottom: '0.5rem', color: '#2563eb', letterSpacing: '0.2px' }}>Add Study Task</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.97rem', color: '#333', fontWeight: 500 }}>Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            style={{
              padding: '0.7rem',
              border: '1px solid #e0e7ef',
              borderRadius: 7,
              fontSize: '1rem',
              outline: 'none',
              background: '#fff',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.97rem', color: '#333', fontWeight: 500 }}>Task Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder={"1. Leetcode pod (1 Medium solved)\n2. GFG Pod (1 medium Solved 14 hard problem)\n3. BuyHatke OA"}
            required
            style={{
              padding: '0.7rem',
              border: '1px solid #e0e7ef',
              borderRadius: 7,
              fontSize: '1rem',
              outline: 'none',
              background: '#fff',
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.97rem', color: '#333', fontWeight: 500 }}>Total Duration (HH:MM:SS)</label>
          <input
            type="text"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            pattern={"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"}
            placeholder="07:00:00"
            required
            style={{
              padding: '0.7rem',
              border: '1px solid #e0e7ef',
              borderRadius: 7,
              fontSize: '1rem',
              outline: 'none',
              background: '#fff',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: '0.5rem',
            padding: '0.7rem',
            borderRadius: 7,
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.05rem',
            cursor: 'pointer',
            letterSpacing: '0.5px',
          }}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddEditTaskPage; 