import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import StreakGraph from '../components/StreakGraph.jsx';
import './css/tracking.css';

const TrackingPage = () => {
  const { averages, totalDuration, totalTasks, lastTaskDate } = useTasks();
  
  // ✅ Simulated AI insights based on averages
  const aiInsights = {
    performanceOverview: {
      totalStudyHours: averages.all || '0',
      weeklyReport: `Your average daily study duration this week is ${averages.weekly || 0}.`,
      monthlyReport: `This month's average daily study duration is ${averages.monthly || 0}.`,
      sixMonthlyReport: `6-month average daily study duration: ${averages.sixMonthly || 0}.`,
      yearlyReport: `Yearly average daily study duration: ${averages.yearly || 0}.`,
      summary: `Your overall average study session duration is ${averages.all || 0}. Keep going strong!`
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
      dataDrivenInsights: `Your best average duration is ${averages.monthly || 0} this month.`,
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
      totalTasks: totalTasks || 0,
      totalStudyTime: averages.all || 0,
      lastActivity: lastTaskDate ? new Date(lastTaskDate).toLocaleDateString() : 'N/A',
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
      <div className="tracking-header">
        <h1>AI Study Insights</h1>
        <p>Personalized analysis of your study patterns and recommendations</p>
      </div>

      {/* ✅ Tab Navigation */}
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
        <button
          className={`tab-button ${activeTab === 'streakgraph' ? 'active' : ''}`}
          onClick={() => setActiveTab('streakgraph')}
        >
          Streak Graph
        </button>
      </div>

      {/* ✅ AI INSIGHTS TAB */}
      {activeTab === 'insights' && (
        <div className="insights-container">
          <div className="insight-card">
            <h3>📊 Performance Overview</h3>
            <div className="performance-grid">
              <div className="performance-item">
                <strong>Total Study Hours:</strong> {aiInsights.performanceOverview.totalStudyHours}
              </div>
              <div className="performance-item">
                <strong>Weekly Report:</strong> {aiInsights.performanceOverview.weeklyReport}
              </div>
              <div className="performance-item">
                <strong>Monthly Report:</strong> {aiInsights.performanceOverview.monthlyReport}
              </div>
              <div className="performance-item">
                <strong>6-Month Report:</strong> {aiInsights.performanceOverview.sixMonthlyReport}
              </div>
              <div className="performance-item">
                <strong>Yearly Report:</strong> {aiInsights.performanceOverview.yearlyReport}
              </div>
              <div className="performance-item">
                <strong>Summary:</strong> {aiInsights.performanceOverview.summary}
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>🎯 Strengths & Weaknesses</h3>
            <div className="strengths-weaknesses">
              <div className="strengths">
                <h4>Strengths:</h4>
                <ul>
                  {aiInsights.strengthsWeaknesses.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="weaknesses">
                <h4>Areas for Improvement:</h4>
                <ul>
                  {aiInsights.strengthsWeaknesses.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
            <p><strong>Analysis:</strong> {aiInsights.strengthsWeaknesses.analysis}</p>
          </div>

          <div className="insight-card">
            <h3>⚡ Productivity Insights</h3>
            <div className="productivity-content">
              <div className="insight-item">
                <strong>Data-Driven Insights:</strong> {aiInsights.productivityInsights.dataDrivenInsights}
              </div>
              <div className="insight-item">
                <strong>Study Patterns:</strong> {aiInsights.productivityInsights.studyPatterns}
              </div>
              <div className="insight-item">
                <strong>Recommendations:</strong> {aiInsights.productivityInsights.recommendations}
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>🧠 Learning Efficiency</h3>
            <div className="efficiency-content">
              <div className="efficiency-item">
                <strong>Retention Level:</strong>
                <span style={{ color: getConsistencyColor(aiInsights.learningEfficiency.retention) }}>
                  {aiInsights.learningEfficiency.retention}
                </span>
              </div>
              <div className="efficiency-item">
                <strong>Efficiency Score:</strong> {aiInsights.learningEfficiency.efficiencyScore}
              </div>
              <div className="efficiency-item">
                <strong>Improvement Areas:</strong> {aiInsights.learningEfficiency.improvementAreas}
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>🤖 AI Feedback</h3>
            <div className="feedback-content">
              <div className="recommendations">
                <h4>Recommendations:</h4>
                <ul>
                  {aiInsights.aiFeedback.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
              <div className="strategies">
                <h4>Study Strategies:</h4>
                <p>{aiInsights.aiFeedback.strategies}</p>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <h3>🏆 Competitive Benchmarking</h3>
            <div className="benchmarking-content">
              <div className="benchmark-item">
                <strong>Current Rank:</strong> {aiInsights.competitiveBenchmarking.currentRank}
              </div>
              <div className="benchmark-item">
                <strong>Improvement Areas:</strong>
                <ul>
                  {aiInsights.competitiveBenchmarking.improvementAreas.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
              <div className="benchmark-item">
                <strong>Path to Top 1%:</strong> {aiInsights.competitiveBenchmarking.top1PercentPath}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ STATS TAB */}
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
              <h4>Last Activity (MM/DD/YY)</h4>
              <p className="stat-value">
                {lastTaskDate ? new Date(lastTaskDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="data-status">
            <p><strong>Data Status:</strong> {aiInsights.hasData ? '✅ Available' : '❌ No data yet'}</p>
            <p><strong>Message:</strong> {aiInsights.message}</p>
          </div>
        </div>
      )}

      {/* ✅ STREAK GRAPH TAB */}
      {activeTab === 'streakgraph' && <StreakGraph />}
    </div>
  );
};

export default TrackingPage;
