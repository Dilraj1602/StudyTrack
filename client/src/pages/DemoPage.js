import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/data';

const steps = [
  {
    title: 'Create Your Account',
    desc: 'Sign up quickly and securely to start tracking your study sessions.'
  },
  {
    title: 'Log Your Study',
    desc: 'Add daily, weekly, or monthly study logs with details and duration.'
  },
  {
    title: 'Analyze Progress',
    desc: 'View smart stats, trends, and recommendations to optimize your learning.'
  },
  {
    title: 'Stay Motivated',
    desc: 'See your achievements, streaks, and testimonials from other learners.'
  }
];

const DemoPage = () => {
  const navigate = useNavigate();
  
  return (
  <div style={{ minHeight: '100vh', background: '#f6f8fa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '3rem 1rem' }}>
    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb', marginBottom: 12 }}>How StudyTrack Works</h1>
    <p style={{ color: '#333', fontSize: '1.15rem', marginBottom: 40, textAlign: 'center', maxWidth: 540 }}>
      StudyTrack makes it easy to log your study sessions, analyze your progress, and stay motivated. Here’s how you can get started in just a few steps:
    </p>
    <div style={{ position: 'relative', maxWidth: 480, width: '100%', margin: '0 auto', padding: '2rem 0 2rem 0' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', position: 'relative', marginBottom: i !== steps.length - 1 ? 48 : 0 }}>
          {/* Step Icon/Number */}
          <div style={{ zIndex: 2, width: 44, height: 44, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', boxShadow: '0 2px 8px rgba(37,99,235,0.10)' }}>
            {i + 1}
          </div>
          {/* Connecting Line */}
          {i !== steps.length - 1 && (
            <div style={{ position: 'absolute', left: 21, top: 44, width: 2, height: 48, background: '#dbeafe', zIndex: 1 }} />
          )}
          {/* Step Content */}
          <div style={{ marginLeft: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '1.3rem 1.2rem', minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 8 }}>{step.title}</div>
            <div style={{ color: '#555', fontSize: '1rem' }}>{step.desc}</div>
          </div>
        </div>
      ))}
    </div>
    <button
      onClick={() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }}
      style={{ marginTop: 40, padding: '0.9rem 2.5rem', fontSize: '1.1rem', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.5px', boxShadow: '0 2px 12px rgba(37,99,235,0.10)' }}
    >
      Get Started
    </button>
  </div>
  );
};

export default DemoPage; 