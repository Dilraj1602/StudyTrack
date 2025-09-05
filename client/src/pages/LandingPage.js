import React, { useRef, useEffect } from 'react';
import { motion, px } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { slogan, features, testimonials } from '../utils/landingData';
import studyTrackImg from '../utils/StudyTrack.png';
import './css/landing.css';

const sectionStyle = {
  maxWidth: 900,
  margin: '0 auto',
  padding: '2.5rem 1rem 1.5rem 1rem',
};
const grid3Col = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '2rem',
};
const gridResponsive = `@media (max-width: 900px) { .landing-grid-3col { grid-template-columns: 1fr !important; } }`;

const stats = [
  { value: '120K+', label: 'Study Logs Tracked' },
  { value: '350K+', label: 'Hours Studied' },
  { value: '45+', label: 'Countries Reached' },
  { value: '98%', label: 'User Satisfaction' },
];

const howItWorks = [
  {
    title: '1. Create Your Account',
    desc: 'Get started in minutes with our simple and secure sign-up process',
  },
  {
    title: '2. Track Your Study',
    desc: 'Log your daily, weekly, or monthly study sessions and see your progress instantly',
  },
  {
    title: '3. Get Insights',
    desc: 'Receive smart stats and recommendations to optimize your learning habits',
  },
];

const LandingPage = () => {
  const imageRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (!imageRef.current) return;
      const y = window.scrollY;
      if (y > 40) {
        imageRef.current.classList.add('scrolled');
      } else {
        imageRef.current.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <div className="landing-hero-flex" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem 2rem 1rem', gap: '2.5rem', flexWrap: 'wrap', marginBottom: 64 }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 520, textAlign: 'center', margin: '0 auto' }}
        >
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2563eb', marginBottom: 10, lineHeight: 1.1 }}>{slogan.title}</h1>
          <p style={{ fontSize: '1.18rem', color: '#333', marginBottom: 28 }}>{slogan.subtitle}</p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
            <button onClick={() => navigate('/demo')} style={{ padding: '0.7rem 2.2rem', fontSize: '1rem', borderRadius: 7, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Watch Demo</button>
            <button onClick={() => {
              // Check if user is logged in
              const token = localStorage.getItem('token');
              if (token) {
                navigate('/dashboard');
              } else {
                navigate('/login');
              }
            }} style={{ padding: '0.7rem 2.2rem', fontSize: '1rem', borderRadius: 7, border: 'none', background: '#e0e7ff', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Get Started</button>
          </div>
        </motion.div>
        <div className="hero-image-wrapper animate-gradient" style={{ width: '100%', maxWidth: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img
            ref={imageRef}
            src={studyTrackImg}
            width={1280}
            height={720}
            alt="Dashboard Preview"
            className="rounded-lg shadow-2xl border mx-auto hero-image"
            style={{ width: '100%', maxWidth: 1280, height: 720, display: 'block', borderRadius: 18, }}
            loading="eager"
          />
        </div>
      </div>
      {/* Stats Bar */}
      <div className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: 120 }}>
            <div style={{ fontWeight: 800, fontSize: '2.1rem', color: '#2563eb', marginBottom: 2 }}>{s.value}</div>
            <div style={{ color: '#333', fontWeight: 600, fontSize: '1.08rem', letterSpacing: '0.5px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={sectionStyle}
        className="features-section"
        id='features'
      >
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', color: '#2563eb', marginBottom: 32 }}>Features</h2>
        <div className="landing-grid-3col" style={grid3Col}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '2rem 1.2rem', textAlign: 'center', minHeight: 180 }}
            >
              <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: '#555', fontSize: '1rem' }}>{f.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* How It Works Section */}
      <div className="how-works-bg">
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', color: '#2563eb', marginBottom: 32 }}>How It Works</h2>
        <div className="how-works-grid" style={{ gap: '96px' }}>
          {howItWorks.map((step, i) => (
            <div key={i} style={{ background: 'transparent', borderRadius: 12, boxShadow: 'none', padding: '2rem 1.2rem', textAlign: 'center', minHeight: 140 }}>
              <div style={{ fontWeight: 700, fontSize: '1.13rem', color: '#222', marginBottom: 8 }}>{step.title}</div>
              <div style={{ color: '#555', fontSize: '1rem' }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-bg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={sectionStyle}
          className="testimonials-center"
          id='Testimonials'
        >
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', color: '#2563eb', marginBottom: 32 }}>Testimonials</h2>
          <div className="landing-grid-3col" style={grid3Col}>
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: '2rem 1.2rem', textAlign: 'center', minHeight: 160 }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>{t.avatar}</div>
                <div style={{ fontWeight: 700, fontSize: '1.08rem', color: '#222', marginBottom: 8 }}>{t.name}</div>
                <div style={{ color: '#555', fontSize: '1rem', fontStyle: 'italic' }}>&ldquo;{t.text}&rdquo;</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="footer-large">
        &copy; {new Date().getFullYear()} StudyTrack &mdash; Track your study. Achieve more.<br/>
        <span style={{ fontWeight: 700, fontSize: '1.08rem', letterSpacing: '1px', color: '#e0e7ff' }}>Made by Dilraj</span>
      </footer>
    </div>
  );
};

export default LandingPage;
