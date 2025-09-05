import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

import './css/tracking.css';

const TrackingPage = () => {
  const { averages, totalDuration, totalTasks, lastTaskDate } = useTasks();
  // No API fetch, generate insights from averages

  // Simulate Gemini-style AI insights using averages
  const aiInsights = {
    performanceOverview: {
      totalStudyHours: averages.all,
      weeklyReport: `Your average daily study duration this week is ${averages.weekly}. Keep up the consistency!`,
      monthlyReport: `This month's average daily study duration is ${averages.monthly}.`,
      sixMonthlyReport: `6-month average daily study duration: ${averages.sixMonthly}.`,
      yearlyReport: `Yearly average daily study duration: ${averages.yearly}.`,
      summary: `Your overall average study session duration is ${averages.all}. Try to maintain or improve this over time.`
    },
    strengthsWeaknesses: {
      strengths: [
        'Consistent study sessions',
        'Good time management',
      ],
      weaknesses: [
        'Could increase session length for deeper focus',
        'Try to reduce distractions during study time',
      ],
      analysis: 'You are maintaining a steady study routine. Focus on increasing the quality and length of your sessions for even better results.'
    },
    productivityInsights: {
      dataDrivenInsights: `Your best average duration is ${averages.monthly} this month.`,
      studyPatterns: 'You tend to study more on weekdays. Consider balancing your schedule for weekends.',
      recommendations: 'Set a daily study goal and track your progress to improve consistency.'
    },
    learningEfficiency: {
      retention: 'Medium',
      efficiencyScore: 'B+',
      improvementAreas: 'Review your notes after each session to boost retention.'
    },
    aiFeedback: {
      recommendations: [
        'Keep a study journal to reflect on your progress.',
        'Experiment with different study techniques to find what works best.'
      ],
      strategies: 'Try the Pomodoro technique and take regular breaks to maximize focus.'
    },
    competitiveBenchmarking: {
      currentRank: 'Top 25%',
      improvementAreas: [
        'Increase average session duration',
        'Participate in group study sessions'
      ],
      top1PercentPath: 'Maintain your current pace and gradually increase your daily study time.'
    },
    dataSummary: {
      totalTasks: '-',
      totalStudyTime: averages.all,
      lastActivity: '-',
    },
    hasData: true,
    message: 'AI insights generated from your study averages.'
  };
  const [activeTab, setActiveTab] = useState('insights');


  const getConsistencyColor = (level) => {
    switch (level) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="tracking-page">
      {/* <div className="averages-debug" style={{ background: '#f3f4f6', padding: 12, borderRadius: 8, marginBottom: 16 }}>
        <h4>⏱️ Average Task Duration</h4>
        <div>Weekly: <b>{averages.weekly}</b></div>
        <div>Monthly: <b>{averages.monthly}</b></div>
        <div>6-Monthly: <b>{averages.sixMonthly}</b></div>
        <div>Yearly: <b>{averages.yearly}</b></div>
        <div>All: <b>{averages.all}</b></div>
      </div> */}
      <div className="tracking-header">
        <h1>AI Study Insights</h1>
        <p>Personalized analysis of your study patterns and recommendations</p>
  {/* <button className="refresh-button">🔄 Refresh Insights</button> */}
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          AI Insights
        </button>
        <button
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Study Statistics
        </button>
      </div>

      {activeTab === 'insights' && (
        <div className="insights-container">
          {/* Performance Overview */}
          <div className="insight-card">
            <h3>📊 Performance Overview</h3>
            <div className="performance-grid">
              <div className="performance-item">
                <strong>Total Study Hours:</strong> {aiInsights.performanceOverview?.totalStudyHours || 'N/A'}
              </div>
              <div className="performance-item">
                <strong>Weekly Report:</strong> {aiInsights.performanceOverview?.weeklyReport || 'N/A'}
              </div>
              <div className="performance-item">
                <strong>Monthly Report:</strong> {aiInsights.performanceOverview?.monthlyReport || 'N/A'}
              </div>
              <div className="performance-item">
                <strong>6-Month Report:</strong> {aiInsights.performanceOverview?.sixMonthlyReport || 'N/A'}
              </div>
              <div className="performance-item">
                <strong>Yearly Report:</strong> {aiInsights.performanceOverview?.yearlyReport || 'N/A'}
              </div>
              <div className="performance-item">
                <strong>Summary:</strong> {aiInsights.performanceOverview?.summary || 'N/A'}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="insight-card">
            <h3>🎯 Strengths & Weaknesses</h3>
            <div className="strengths-weaknesses">
              <div className="strengths">
                <h4>Strengths:</h4>
                <ul>
                  {aiInsights.strengthsWeaknesses?.strengths?.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  )) || <li>No data available</li>}
                </ul>
              </div>
              <div className="weaknesses">
                <h4>Areas for Improvement:</h4>
                <ul>
                  {aiInsights.strengthsWeaknesses?.weaknesses?.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  )) || <li>No data available</li>}
                </ul>
              </div>
            </div>
            <p><strong>Analysis:</strong> {aiInsights.strengthsWeaknesses?.analysis || 'No analysis available'}</p>
          </div>

          {/* Productivity Insights */}
          <div className="insight-card">
            <h3>⚡ Productivity Insights</h3>
            <div className="productivity-content">
              <div className="insight-item">
                <strong>Data-Driven Insights:</strong> {aiInsights.productivityInsights?.dataDrivenInsights || 'N/A'}
              </div>
              <div className="insight-item">
                <strong>Study Patterns:</strong> {aiInsights.productivityInsights?.studyPatterns || 'N/A'}
              </div>
              <div className="insight-item">
                <strong>Recommendations:</strong> {aiInsights.productivityInsights?.recommendations || 'N/A'}
              </div>
            </div>
          </div>

          {/* Learning Efficiency */}
          <div className="insight-card">
            <h3>🧠 Learning Efficiency</h3>
            <div className="efficiency-content">
              <div className="efficiency-item">
                <strong>Retention Level:</strong> 
                <span style={{ color: getConsistencyColor(aiInsights.learningEfficiency?.retention) }}>
                  {aiInsights.learningEfficiency?.retention || 'N/A'}
                </span>
              </div>
              <div className="efficiency-item">
                <strong>Efficiency Score:</strong> {aiInsights.learningEfficiency?.efficiencyScore || 'N/A'}
              </div>
              <div className="efficiency-item">
                <strong>Improvement Areas:</strong> {aiInsights.learningEfficiency?.improvementAreas || 'N/A'}
              </div>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="insight-card">
            <h3>🤖 AI Feedback</h3>
            <div className="feedback-content">
              <div className="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                  {aiInsights.aiFeedback?.recommendations?.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  )) || <li>No recommendations available</li>}
                </ul>
              </div>
              <div className="strategies">
                <h4>Study Strategies:</h4>
                <p>{aiInsights.aiFeedback?.strategies || 'No strategies available'}</p>
              </div>
            </div>
          </div>

          {/* Competitive Benchmarking */}
          <div className="insight-card">
            <h3>🏆 Competitive Benchmarking</h3>
            <div className="benchmarking-content">
              <div className="benchmark-item">
                <strong>Current Rank:</strong> {aiInsights.competitiveBenchmarking?.currentRank || 'N/A'}
              </div>
              <div className="benchmark-item">
                <strong>Improvement Areas:</strong>
                <ul>
                  {aiInsights.competitiveBenchmarking?.improvementAreas?.map((area, index) => (
                    <li key={index}>{area}</li>
                  )) || <li>No areas identified</li>}
                </ul>
              </div>
              <div className="benchmark-item">
                <strong>Path to Top 1%:</strong> {aiInsights.competitiveBenchmarking?.top1PercentPath || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="stats-container">
          <div className="stats-header">
            <h3>📈 Study Statistics</h3>
            <p>Real-time data from your study sessions</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Tasks</h4>
              <p className="stat-value">{totalTasks}</p>
            </div>
            <div className="stat-card">
              <h4>Total Study Time</h4>
              <p className="stat-value">{totalDuration}</p>
            </div>
            <div className="stat-card">
              <h4>Last Activity</h4>
              <p className="stat-value">{lastTaskDate ? new Date(lastTaskDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          
          <div className="data-status">
            <p><strong>Data Status:</strong> {aiInsights.hasData ? '✅ Available' : '❌ No data yet'}</p>
            <p><strong>Message:</strong> {aiInsights.message || 'No message available'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
