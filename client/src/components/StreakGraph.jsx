import React, { useEffect, useState } from "react";
import { getTasks } from "../api";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import "./StreakGraph.css";

dayjs.extend(weekOfYear);

const StreakGraph = () => {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [taskDates, setTaskDates] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [totalActive, setTotalActive] = useState(0);
  const [calendarData, setCalendarData] = useState([]);

  const calculateStreak = (dates) => {
    let currentStreak = 0;
    let maxStreak = 0;
    const sortedDates = Array.from(dates)
      .map((d) => dayjs(d))
      .sort((a, b) => a - b);
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) currentStreak = 1;
      else {
        const diff = sortedDates[i].diff(sortedDates[i - 1], "day");
        currentStreak = diff === 1 ? currentStreak + 1 : 1;
      }
      maxStreak = Math.max(maxStreak, currentStreak);
    }
    return maxStreak;
  };

  const generateCalendar = (dates, year) => {
    const months = [];
    
    // Generate calendar data for each month
    for (let month = 0; month < 12; month++) {
      const firstDay = dayjs().year(year).month(month).startOf('month');
      const daysInMonth = firstDay.daysInMonth();
      const startWeekday = firstDay.day(); // 0 = Sunday
      
      const days = [];
      // Add empty cells for days before the first of the month
      for (let i = 0; i < startWeekday; i++) {
        days.push({ date: null, isEmpty: true });
      }
      
      // Add the actual days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = firstDay.date(day);
        const formatted = date.format("YYYY-MM-DD");
        days.push({
          date: formatted,
          day,
          isEmpty: false,
          active: dates.has(formatted)
        });
      }
      
      months.push({
        name: firstDay.format('MMMM'),
        days
      });
    }
    
    setCalendarData(months);
  };

  const fetchTasks = async (year) => {
    try {
      const res = await getTasks();
      const tasks = res.data;

      const dates = new Set();
      tasks.forEach((task) => {
        const dateStr = dayjs(task.date).format("YYYY-MM-DD");
        if (dayjs(dateStr).year() === year) dates.add(dateStr);
      });

      setTaskDates(dates);
      setTotalActive(dates.size);
      setStreak(calculateStreak(dates));
      generateCalendar(dates, year);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks(selectedYear);
  }, [selectedYear]);

  return (
    <div className="streak-container">
      <div className="header">
        <h2>🔥 Streak Tracker</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="year-select"
        >
          {[...Array(5)].map((_, i) => (
            <option key={i} value={currentYear - i}>
              {currentYear - i}
            </option>
          ))}
        </select>
      </div>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Max Streak:</span>
          <span className="stat-value">{streak} days</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Active Days:</span>
          <span className="stat-value">{totalActive} days</span>
        </div>
      </div>

      <div className="calendar-container">
        {calendarData.map((month) => (
          <div key={month.name} className="month-container">
            <h3 className="month-title">{month.name}</h3>
            <div className="week-days">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="days-grid">
              {month.days.map((day, index) => (
                <div
                  key={`${month.name}-${index}`}
                  className={`day-cell ${day.isEmpty ? "empty" : ""} ${
                    day.active ? "active" : ""
                  }`}
                  title={day.date ? `${day.date}: ${day.active ? "Active" : "Inactive"}` : ""}
                >
                  {!day.isEmpty && day.day}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreakGraph;
