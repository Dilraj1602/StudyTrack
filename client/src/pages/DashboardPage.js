import React, { useState, useMemo, useRef, useState as useReactState } from 'react';
import initialTasksData from '../utils/data';
import toast, { Toaster } from 'react-hot-toast';
import './css/dashboard.css';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import MonthlyChart from '../components/MonthlyChart';

const FILTERS = [
  { label: 'All', value: 'All' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
  { label: '6-Month', value: '6-Month' },
  { label: 'Yearly', value: 'Yearly' },
];

const SORTS = [
  { label: 'Date (Newest)', value: 'date_desc' },
  { label: 'Date (Oldest)', value: 'date_asc' },
  { label: 'Duration (Shortest)', value: 'duration_asc' },
  { label: 'Duration (Longest)', value: 'duration_desc' },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: '2-digit'
  });
}

function sumDurations(durations) {
  let totalSeconds = durations.reduce((acc, t) => {
    const [h, m, s] = t.split(':').map(Number);
    return acc + h * 3600 + m * 60 + s;
  }, 0);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function durationToSeconds(duration) {
  const [h, m, s] = duration.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const showToast = (fn, message) => {
  const id = fn(message);
  setTimeout(() => toast.dismiss(id), 5000);
};

const CalendarIcon = ({ onClick }) => (
  <svg onClick={onClick} style={{ cursor: 'pointer', width: 22, height: 22, position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#2563eb' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor"/>
  </svg>
);

const DashboardPage = () => {
  const [tasks, setTasks] = useState(initialTasksData);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date_desc');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ tasks: '', duration: '' });
  const [addForm, setAddForm] = useState({ tasks: '', duration: '', date: '' });
  const [showDatePicker, setShowDatePicker] = useReactState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 7;
  // Remove useRef and any focus logic

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  React.useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (err) {
        toast.error('Failed to load tasks');
      }
    }
    fetchTasks();
    // console.log(tasks, 'tasks');
  }, []);

  const filteredTasks = useMemo(() => {
    let arr = [...tasks];

    // Date search: check for dd-mm-yy or dd-mm-yyyy
    const dateRegex = /^(\d{2})-(\d{2})-(\d{2,4})$/;
    if (search.trim() && dateRegex.test(search.trim())) {
      const [, dd, mm, y] = search.trim().match(dateRegex);
      // Accept both yy and yyyy
      const yyyy = y.length === 2 ? '20' + y : y;
      const dateStr = `${yyyy}-${mm}-${dd}`;
      arr = arr.filter(t => t.date === dateStr);
    } else {
      if (filter !== 'All') {
        const fromDate = (days) => addDays(today, -days);
        const dateCheck = (d) => {
          const date = new Date(d);
          return date >= fromDate(
            filter === 'Weekly' ? 6 :
            filter === 'Monthly' ? 30 :
            filter === '6-Month' ? 182 :
            filter === 'Yearly' ? 365 : 0
          ) && date <= today;
        };
        arr = arr.filter(t => dateCheck(t.date));
      }
      if (search.trim()) {
        arr = arr.filter(task =>
          task.description.some(desc =>
            desc.toLowerCase().includes(search.toLowerCase())
          )
        );
      }
    }

    arr.sort((a, b) => {
      if (sort === 'date_asc') return a.date.localeCompare(b.date);
      if (sort === 'date_desc') return b.date.localeCompare(a.date);
      if (sort === 'duration_asc') return durationToSeconds(a.duration) - durationToSeconds(b.duration);
      if (sort === 'duration_desc') return durationToSeconds(b.duration) - durationToSeconds(a.duration);
      return 0;
    });
    return arr;
  }, [tasks, filter, search, sort, today]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, search, sort]);

  const groupedByDate = useMemo(() => {
    // If sorting by date, group by date and sort groups by date
    if (sort === 'date_asc' || sort === 'date_desc') {
      const byDate = {};
      filteredTasks.forEach(task => {
        if (!byDate[task.date]) byDate[task.date] = [];
        byDate[task.date].push(task);
      });
      // Sort groups by date
      const sortedDates = Object.keys(byDate).sort((a, b) =>
        sort === 'date_asc' ? a.localeCompare(b) : b.localeCompare(a)
      );
      return sortedDates.map(date => [date, byDate[date]]);
    } else {
      // For duration sorts, flatten, sort, then group by date in sorted order
      const sorted = [...filteredTasks].sort((a, b) => {
        if (sort === 'duration_asc') return durationToSeconds(a.duration) - durationToSeconds(b.duration);
        if (sort === 'duration_desc') return durationToSeconds(b.duration) - durationToSeconds(a.duration);
        return 0;
      });
      // Group by date in the order they appear
      const byDate = [];
      let lastDate = null;
      let currentGroup = [];
      sorted.forEach(task => {
        if (task.date !== lastDate) {
          if (currentGroup.length) byDate.push([lastDate, currentGroup]);
          lastDate = task.date;
          currentGroup = [task];
        } else {
          currentGroup.push(task);
        }
      });
      if (currentGroup.length) byDate.push([lastDate, currentGroup]);
      return byDate;
    }
  }, [filteredTasks, sort]);

  // Pagination logic
  const allTasks = groupedByDate.flatMap(([date, logs]) => 
    logs.map(task => ({ ...task, date }))
  );
  
  const totalPages = Math.ceil(allTasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = allTasks.slice(startIndex, endIndex);

  // Group current page tasks by date
  const currentPageGrouped = useMemo(() => {
    const byDate = {};
    currentTasks.forEach(task => {
      if (!byDate[task.date]) byDate[task.date] = [];
      byDate[task.date].push(task);
    });
    return Object.entries(byDate);
  }, [currentTasks]);

  const totalDuration = sumDurations(filteredTasks.map(t => t.duration));
  const uniqueDays = new Set(filteredTasks.map(t => t.date)).size || 1;

  const avgPerDay = (() => {
    const totalSeconds = filteredTasks.reduce((acc, t) => acc + durationToSeconds(t.duration), 0);
    const avg = Math.floor(totalSeconds / uniqueDays);
    const h = String(Math.floor(avg / 3600)).padStart(2, '0');
    const m = String(Math.floor((avg % 3600) / 60)).padStart(2, '0');
    const s = String(avg % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  })();

  const handleEdit = (task) => {
    setEditTaskId(task._id);
    setEditForm({
      tasks: (task.tasks || []).join('\n'),
      duration: task.duration
    });
  };

  const handleEditSubmit = async (e, task) => {
    e.preventDefault();
    try {
      const updated = {
        date: task.date,
        tasks: editForm.tasks.split('\n'),
        duration: editForm.duration
      };
      const res = await updateTask(task._id, updated);
      setTasks(prev => prev.map(t => t._id === task._id ? res.data : t));
      setEditTaskId(null);
      showToast(toast.success, 'Log updated!');
    } catch (err) {
      toast.error('Failed to update log');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.tasks.trim() || !addForm.duration.trim() || !addForm.date) return;
    try {
      const payload = {
        date: addForm.date,
        tasks: addForm.tasks.split('\n'),
        duration: addForm.duration
      };
      const res = await createTask(payload);
      setTasks(prev => [...prev, res.data]);
      setAddForm({ tasks: '', duration: '', date: todayStr });
      showToast(toast.success, 'Log created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add log');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      showToast(toast.success, 'Log deleted!');
    } catch (err) {
      toast.error('Failed to delete log');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ minHeight: '80vh', background: '#f8f9fa', padding: '2rem 0' }}>
      <Toaster position="top-right" />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem' }}>
        <h2 style={{
          fontWeight: 800, fontSize: '2rem', color: '#2563eb',
          marginBottom: '1.5rem', letterSpacing: '0.5px', textAlign: 'center'
        }}>
          Study Dashboard
        </h2>

        {/* Monthly Chart */}
        <MonthlyChart tasks={tasks} />



        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <StatCard label="Total Duration" value={totalDuration} />
          <StatCard label="Avg/Day" value={avgPerDay} />
        </div>

        {/* Filter/Search/Sort */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="13-07-25"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyle, paddingRight: 36, minWidth: 180 }}
            />
            <CalendarIcon onClick={() => setShowDatePicker(true)} />
            {showDatePicker && (
              <input
              type="date"
              onChange={e => {
                if (e.target.value) {
                  const d = new Date(e.target.value);
                  const yy = String(d.getFullYear()).slice(2);
                  const mm = String(d.getMonth() + 1).padStart(2, '0');
                  const dd = String(d.getDate()).padStart(2, '0');
                  setSearch(`${dd}-${mm}-${yy}`);
                  setShowDatePicker(false);
                }
              }}
              className="custom-date-input"
              onBlur={() => setShowDatePicker(false)}
              autoFocus
            />
            
            )}
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={selectStyle}>
            {FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={selectStyle}>
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Add Form */}
        <form onSubmit={handleAddSubmit} className="add-form">
          <div className="add-form-title">Add New Task</div>
          <input
            type="date"
            value={addForm.date}
            onChange={e => setAddForm(f => ({ ...f, date: e.target.value }))}
            className="add-form-input"
            required
          />
          <textarea
            value={addForm.tasks}
            onChange={e => setAddForm(f => ({ ...f, tasks: e.target.value }))}
            rows={3}
            placeholder={'1. Task description\n2. Task description'}
            className="add-form-textarea"
          />
          <div className="add-form-footer">
            <input
              type="text"
              value={addForm.duration}
              onChange={e => setAddForm(f => ({ ...f, duration: e.target.value }))}
              placeholder="Total Duration (01:30:00)"
              className="add-form-input"
            />
            <button type="submit" className="add-form-button">Add Task</button>
          </div>
        </form>

        {/* Logs */}
        <div style={formCardStyle}>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="logs-title" >Tasks {filter !== 'All' && `(${filter})`}</span>
            <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
              Showing {startIndex + 1}-{Math.min(endIndex, allTasks.length)} of {allTasks.length} tasks
            </span>
          </div>
          {currentPageGrouped.length === 0 && <div style={{ color: '#888' }}>No logs available.</div>}
          {currentPageGrouped.map(([date, logs]) => (
            <div key={date} style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#2563eb', fontSize: '1.08rem', marginBottom: 6 }}>
                {formatDate(date)}
              </div>
              {logs.map(task => (
                <div key={task._id} style={{ marginBottom: '1.2rem' }}>
                  {editTaskId === task._id ? (
                    <form onSubmit={e => handleEditSubmit(e, task)}>
                      <textarea
                        value={editForm.tasks}
                        onChange={e => setEditForm(f => ({ ...f, tasks: e.target.value }))}
                        rows={3}
                        style={textAreaStyle}
                      />
                      <input
                        type="text"
                        value={editForm.duration}
                        onChange={e => setEditForm(f => ({ ...f, duration: e.target.value }))}
                        style={inputStyle}
                      />
                      <button type="submit" style={{ ...buttonStyle, marginRight: 8 }}>Save</button>
                      <button type="button" onClick={() => setEditTaskId(null)} style={cancelButtonStyle}>Cancel</button>
                    </form>
                  ) : (
                    <>
                      {(task.tasks || []).map((desc, i) => (
                        <div key={`${task._id}-${i}`} style={{ fontSize: '1.05rem', color: '#333', marginBottom: 2 }}>
                          {desc}
                        </div>
                      ))}
                      <div style={{ fontWeight: 600, color: '#2563eb', marginTop: 8 }}>
                        total- {task.duration}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        <button onClick={() => handleEdit(task)} style={{ ...buttonStyle, marginRight: 8 }}>Edit</button>
                        <button onClick={() => handleDelete(task._id)} style={deleteButtonStyle}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '1rem', 
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  ...buttonStyle,
                  background: currentPage === 1 ? '#e5e7eb' : '#2563eb',
                  color: currentPage === 1 ? '#999' : '#fff',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  padding: '0.5rem 1rem'
                }}
              >
                Previous
              </button>
              
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: 600, 
                color: '#2563eb',
                padding: '0.5rem 1rem',
                background: '#f8f9fa',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                {currentPage} / {totalPages}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  ...buttonStyle,
                  background: currentPage === totalPages ? '#e5e7eb' : '#2563eb',
                  color: currentPage === totalPages ? '#999' : '#fff',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  padding: '0.5rem 1rem'
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Shared Styles
const inputStyle = {
  padding: '0.5rem 1rem',
  borderRadius: 7,
  border: '1px solid #e5e7eb',
  fontSize: '1rem',
  minWidth: 180,
  outline: 'none',
};

const selectStyle = {
  ...inputStyle,
  fontWeight: 600,
  color: '#2563eb',
};

const textAreaStyle = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: 6,
  border: '1px solid #e5e7eb',
  fontSize: '1rem',
  marginBottom: 6,
};

const buttonStyle = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  padding: '0.4rem 1.2rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const cancelButtonStyle = {
  ...buttonStyle,
  background: '#e5e7eb',
  color: '#222',
};

const deleteButtonStyle = {
  ...buttonStyle,
  background: '#dc2626',
};

const formCardStyle = {
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
  padding: '1.5rem',
  border: '1px solid #e5e7eb',
  marginBottom: '2rem',
};

const StatCard = ({ label, value }) => (
  <div style={{
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
    padding: '1.1rem',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    minWidth: 180
  }}>
    <div style={{ fontWeight: 700, color: '#222', fontSize: '1.1rem', marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2563eb' }}>{value}</div>
  </div>
);

export default DashboardPage;
 