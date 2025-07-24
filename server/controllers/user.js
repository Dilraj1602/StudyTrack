const User = require('../models/User');
const Task = require('../models/Task');
let redis, redisClient;
let REDIS_ENABLED = true;
try {
  redis = require('redis');
  redisClient = redis.createClient({ url: process.env.REDIS_URL });
  redisClient.connect().catch((e) => {
    console.error('Redis connection failed, disabling cache:', e);
    REDIS_ENABLED = false;
  });
} catch (e) {
  console.error('Redis not available, disabling cache:', e);
  REDIS_ENABLED = false;
}
const CACHE_TTL = 5 * 60; // 5 minutes in seconds

// Add this utility for safe Redis operations
async function safeRedisDel(key) {
  if (!REDIS_ENABLED) return;
  try { await redisClient.del(key); } catch (e) { console.error('Redis DEL error:', e); }
}
async function safeRedisGet(key) {
  if (!REDIS_ENABLED) return null;
  try { return await redisClient.get(key); } catch (e) { console.error('Redis GET error:', e); return null; }
}
async function safeRedisSetEx(key, ttl, value) {
  if (!REDIS_ENABLED) return;
  try { await redisClient.setEx(key, ttl, value); } catch (e) { console.error('Redis SETEX error:', e); }
}

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user;
    // Try to get from Redis cache
    const cached = await safeRedisGet(`user:${userId}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Store in Redis cache
    await safeRedisSetEx(`user:${userId}`, CACHE_TTL, JSON.stringify(user));
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) return res.status(400).json({ message: 'First and last name required' });
    const user = await User.findByIdAndUpdate(userId, { firstName, lastName }, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Invalidate user cache
    await safeRedisDel(`user:${userId}`);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Try to get from Redis cache
    const cached = await safeRedisGet('leaderboard');
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const users = await User.find({}, 'firstName lastName tasks');
    const leaderboard = [];
    for (const user of users) {
      const tasks = await Task.find({ _id: { $in: user.tasks } });
      let totalSeconds = 0;
      for (const task of tasks) {
        const [h, m, s] = task.duration.split(':').map(Number);
        totalSeconds += h * 3600 + m * 60 + s;
      }
      leaderboard.push({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        totalDuration: totalSeconds
      });
    }
    leaderboard.sort((a, b) => b.totalDuration - a.totalDuration);
    // Store in Redis cache
    await safeRedisSetEx('leaderboard', CACHE_TTL, JSON.stringify(leaderboard));
    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    // ... update logic ...
    await safeRedisDel('leaderboard');
    await safeRedisDel(`user:${req.user}`);
    res.json({ message: 'Task updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Note: If user/task data is updated, consider invalidating the relevant cache entries with redisClient.del. 