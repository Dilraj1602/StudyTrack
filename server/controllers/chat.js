const User = require('../models/User');
const Task = require('../models/Task');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;

exports.chatWithBot = async (req, res) => {
  try {
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

    const { message, frontendData } = req.body;
    let prompt = '';
    let userData = null;

    if (req.user) {
      const user = await User.findById(req.user).select('-password');
      const tasks = await Task.find({ user: req.user });
      userData = { user, tasks, frontendData };
      prompt = `You are a study assistant. The user is logged in. Here is their data: ${JSON.stringify(userData)}.\nUser: ${message}\nAssistant:`;
    } else {
      prompt = `You are a study assistant for a study tracking app. The user is not logged in. Answer questions about the app or general study tips.\nUser: ${message}\nAssistant:`;
    }

    const body = {
      contents: [
        { parts: [{ text: prompt }] }
      ]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get response from Gemini API');
    }
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not get a response.';
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Failed to get response from chatbot.' });
  }
}; 