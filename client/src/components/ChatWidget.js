import React, { useState, useRef, useEffect } from 'react';
import './ChatWidget.css';

const ChatWidget = ({ frontendData }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your study assistant. How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [genericMode, setGenericMode] = useState(false);
  const messagesEndRef = useRef(null);

  // Listen for logout event to clear chat and show generic mode message
  useEffect(() => {
    const handleLogout = () => {
      setMessages([
        { sender: 'bot', text: 'You have logged out. The chatbot is now in generic mode and will not use your personal data.' }
      ]);
      setGenericMode(true);
    };
    window.addEventListener('user-logged-out', handleLogout);
    return () => {
      window.removeEventListener('user-logged-out', handleLogout);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: input, frontendData }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'bot', text: data.response || 'Sorry, I could not get a response.' }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Error contacting the chatbot.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  React.useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  return (
    <div className="chat-widget-container">
      {open ? (
        <div className="chat-widget-box">
          <div className="chat-widget-header">
            <span>Study Assistant</span>
            <button className="chat-widget-close" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="chat-widget-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-widget-message ${msg.sender}`}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-widget-input-row">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}>{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      ) : (
        <button className="chat-widget-fab" onClick={() => setOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget; 