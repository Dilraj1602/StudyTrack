import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages/css/dashboard.css';

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { withCredentials: true };
        
        if (token) {
          config.headers = { Authorization: `Bearer ${token}` };
        }
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/tasks/leaderboard`, config);
        setLeaderboard(res.data);
      } catch (err) {
        setError('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const badgeEmojis = ['🥇', '🥈', '🥉'];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(37,99,235,0.10)',
        padding: '2.5rem 2rem',
        maxWidth: 900,
        width: '95%',
        margin: '2rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{
          fontWeight: 900,
          fontSize: '2.2rem',
          color: '#2563eb',
          marginBottom: '1.5rem',
          letterSpacing: '1px',
          textShadow: '0 2px 8px rgba(37,99,235,0.07)'
        }}>Leaderboard</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              background: 'transparent',
              fontSize: '1.08rem',
              boxShadow: '0 2px 8px rgba(37,99,235,0.04)'
            }}>
              <thead>
                <tr style={{ background: '#f3f6fd' }}>
                  <th style={{ padding: '0.8rem', borderTopLeftRadius: 12 }}>Rank</th>
                  <th style={{ padding: '0.8rem' }}>First Name</th>
                  <th style={{ padding: '0.8rem' }}>Last Name</th>
                  <th style={{ padding: '0.8rem', borderTopRightRadius: 12 }}>Total Duration ( in hrs )</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr key={user.userId}>
                    <td style={{ padding: '0.7rem', textAlign: 'center' }}>
                      {idx + 1} {idx < 3 && <span style={{ fontSize: '1.3rem', marginLeft: 4 }}>{badgeEmojis[idx]}</span>}
                    </td>
                    <td style={{ padding: '0.7rem', textAlign: 'center' }}>{user.firstName}</td>
                    <td style={{ padding: '0.7rem', textAlign: 'center' }}>{user.lastName}</td>
                    <td style={{ padding: '0.7rem', textAlign: 'center', fontFamily: 'monospace' }}>{formatDuration(user.totalDuration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage; 