import React, { useState, useEffect, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import toast from 'react-hot-toast';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyChart = ({ tasks }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate year options from available data
  const yearOptions = useMemo(() => {
    const years = [...new Set(tasks.map(task => task.date.split('-')[0]))];
    return years.sort((a, b) => b - a); // Sort descending
  }, [tasks]);

  // Calculate monthly stats from tasks data
  const monthlyStats = useMemo(() => {
    // console.log('Calculating monthly stats for year:', selectedYear);
    // console.log('Total tasks:', tasks.length);
    
    // Filter tasks for selected year
    const yearTasks = tasks.filter(task => task.date.startsWith(selectedYear));
    // console.log('Tasks for year', selectedYear, ':', yearTasks.length);
    
    // Group by month
    const monthlyData = {};
    yearTasks.forEach(task => {
      const month = parseInt(task.date.split('-')[1]);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          durations: [],
          dayCount: 0
        };
      }
      monthlyData[month].durations.push(task.duration);
      monthlyData[month].dayCount++;
    });
    
    // console.log('Monthly data:', monthlyData);
    
    // Calculate averages for all months (1-12)
    const result = [];
    for (let month = 1; month <= 12; month++) {
      const monthData = monthlyData[month];
      let avgHours = 0;
      let dayCount = 0;
      
      if (monthData) {
        // Calculate total seconds
        const totalSeconds = monthData.durations.reduce((acc, duration) => {
          const [h, m, s] = duration.split(':').map(Number);
          return acc + h * 3600 + m * 60 + s;
        }, 0);
        
        avgHours = totalSeconds / monthData.dayCount / 3600;
        dayCount = monthData.dayCount;
      }
      
      result.push({
        month: month,
        monthName: new Date(2000, month - 1).toLocaleString('default', { month: 'short' }),
        avgHours: Math.round(avgHours * 100) / 100,
        dayCount: dayCount
      });
    }
    
    // console.log('Final monthly stats:', result);
    return result;
  }, [tasks, selectedYear]);

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!monthlyStats.length) return null;
    
    return {
      labels: monthlyStats.map(item => item.monthName),
      datasets: [
        {
          label: 'Average Daily Duration (hours)',
          data: monthlyStats.map(item => item.avgHours),
          backgroundColor: monthlyStats.map(item => {
            if (item.avgHours === 0) return '#e5e7eb'; // Gray for no data
            if (item.avgHours > 8) return '#dc2626'; // Red for > 8 hours
            if (item.avgHours > 4) return '#f97316'; // Orange for > 4 hours
            return '#22c55e'; // Green for ≤ 4 hours
          }),
          borderColor: monthlyStats.map(item => {
            if (item.avgHours === 0) return '#d1d5db';
            if (item.avgHours > 8) return '#b91c1c';
            if (item.avgHours > 4) return '#ea580c';
            return '#16a34a';
          }),
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [monthlyStats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Average Daily Study Duration by Month - ${selectedYear}`,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#1f2937',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            if (value === 0) {
              return 'No data available';
            }
            const hours = Math.floor(value);
            const minutes = Math.round((value - hours) * 60);
            return `Average: ${hours}h ${minutes}m per day`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#374151',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Average Hours per Day',
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#374151',
        },
        beginAtZero: true,
        max: 12,
        ticks: {
          callback: function(value) {
            return value + 'h';
          },
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 10,
      boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
      padding: '1.5rem',
      border: '1px solid #e5e7eb',
      marginBottom: '2rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
      }}>
        <h3 style={{
          fontWeight: 700,
          fontSize: '1.2rem',
          color: '#1f2937',
          margin: 0,
        }}>
          Monthly Study Statistics
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '1rem' }}>
          <label style={{
            fontWeight: 600,
            color: '#374151',
            fontSize: '0.9rem',
          }}>
            Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#2563eb',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1.5rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 16,
            height: 16,
            backgroundColor: '#22c55e',
            borderRadius: 3,
          }}></div>
          <span style={{ fontSize: '0.85rem', color: '#374151' }}>≤ 4 hours</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 16,
            height: 16,
            backgroundColor: '#f97316',
            borderRadius: 3,
          }}></div>
          <span style={{ fontSize: '0.85rem', color: '#374151' }}>4-8 hours</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 16,
            height: 16,
            backgroundColor: '#dc2626',
            borderRadius: 3,
          }}></div>
          <span style={{ fontSize: '0.85rem', color: '#374151' }}>&gt; 8 hours</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 16,
            height: 16,
            backgroundColor: '#e5e7eb',
            borderRadius: 3,
          }}></div>
          <span style={{ fontSize: '0.85rem', color: '#374151' }}>No data</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '400px', position: 'relative' }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: '#6b7280',
            fontSize: '1rem',
          }}>
            No data available for the selected year
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyChart; 