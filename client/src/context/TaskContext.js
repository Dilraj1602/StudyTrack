import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getTasks } from '../api';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  return new Date(d.setDate(diff));
};

const getStartOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const getStartOf6Months = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() - 5, 1);
};

const getStartOfYear = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), 0, 1);
};

// Helper to parse duration string (HH:mm:ss) to seconds
const parseDuration = (durationStr) => {
  if (!durationStr) return 0;
  if (typeof durationStr === 'number') return durationStr;
  const [h = '0', m = '0', s = '0'] = durationStr.split(':');
  return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s);
};

// Use task.date for filtering (format: YYYY-MM-DD)
const filterTasksByDate = (tasks, startDate) => {
  return tasks.filter(task => {
    const taskDate = new Date(task.date);
    return taskDate >= startDate;
  });
};


// Convert seconds to HH:MM:SS string
const formatSecondsToHMS = (seconds) => {
  if (!isFinite(seconds) || seconds <= 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
};

const calculateAverageDuration = (tasks) => {
  if (!tasks.length) return '00:00:00';
  const total = tasks.reduce((sum, t) => sum + parseDuration(t.duration), 0);
  const avg = total / tasks.length;
  return formatSecondsToHMS(avg);
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks();
      setTasks(res.data.tasks || res.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  // Utility functions for averages and stats
  const now = new Date();
  const weeklyTasks = filterTasksByDate(tasks, getStartOfWeek(now));
  const monthlyTasks = filterTasksByDate(tasks, getStartOfMonth(now));
  const sixMonthTasks = filterTasksByDate(tasks, getStartOf6Months(now));
  const yearlyTasks = filterTasksByDate(tasks, getStartOfYear(now));

  const averages = {
    weekly: calculateAverageDuration(weeklyTasks),
    monthly: calculateAverageDuration(monthlyTasks),
    sixMonthly: calculateAverageDuration(sixMonthTasks),
    yearly: calculateAverageDuration(yearlyTasks),
    all: calculateAverageDuration(tasks),
  };

  // Total duration in seconds
  const totalDurationSeconds = tasks.reduce((sum, t) => sum + parseDuration(t.duration), 0);
  // Format total duration as HH:MM:SS
  const formatSecondsToHMS = (seconds) => {
    if (!isFinite(seconds) || seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  };
  const totalDuration = formatSecondsToHMS(totalDurationSeconds);
  const totalTasks = tasks.length;
  // Last task date (latest by date field)
  const lastTaskDate = tasks.length > 0 ? tasks.reduce((latest, t) => {
    const d = new Date(t.date);
    return d > latest ? d : latest;
  }, new Date(tasks[0].date)).toISOString().split('T')[0] : null;

  // useEffect(() => {
  //   console.log('[TaskContext] tasks:', tasks);
  //   console.log('[TaskContext] averages:', averages);
  //   console.log('[TaskContext] loading:', loading);
  //   console.log('[TaskContext] error:', error);
  // }, [tasks, averages, loading, error]);

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      error,
      fetchTasks,
      averages,
      totalDuration,
      totalTasks,
      lastTaskDate,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
