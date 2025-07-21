import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddEditTaskPage from './pages/AddEditTaskPage';
import NotFoundPage from './pages/NotFoundPage';
import DemoPage from './pages/DemoPage';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Navbar />
      <style>{`html, body { overflow-x: hidden !important; width: 100vw !important; }`}</style>
      <div style={{ paddingTop: '4.5rem', width: '100vw', minWidth: 0, overflowX: 'hidden' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/add-task" element={<AddEditTaskPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
