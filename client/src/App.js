import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddEditTaskPage from './pages/AddEditTaskPage';
import NotFoundPage from './pages/NotFoundPage';
import DemoPage from './pages/DemoPage';
import LeaderboardPage from './pages/LeaderboardPage';
import './styles/global.css';
import axios from 'axios';
import ChatWidget from './components/ChatWidget';

// PrivateRoute component using async API check
function PrivateRoute({ children }) {
  const [authChecked, setAuthChecked] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';
        const res = await axios.get(`${API_URL}/auth/current-user`, { withCredentials: true });
        setIsAuthenticated(res.data.loggedIn);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  if (!authChecked) {
    return <div style={{textAlign:'center',marginTop:'3rem'}}>Checking authentication...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  React.useEffect(() => {
    async function checkLogin() {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';
        const res = await axios.get(`${API_URL}/auth/current-user`, { withCredentials: true });
        setIsLoggedIn(res.data.loggedIn);
      } catch {
        setIsLoggedIn(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <Router>
      <Navbar />
      <style>{`html, body { overflow-x: hidden !important; width: 100vw !important; }`}</style>
      <div style={{ paddingTop: '4.5rem', width: '100vw', minWidth: 0, overflowX: 'hidden' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/add-task" element={<AddEditTaskPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;
