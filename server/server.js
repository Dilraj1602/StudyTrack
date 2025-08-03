require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3000',               
  'https://studytrack-1a.onrender.com',  
  'https://studytrack-5s52.onrender.com' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// Base API router
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/tasks', taskRoutes);
apiRouter.use('/chat', chatRoutes);
app.use('/api/v1', apiRouter);

connectDB().then(() => {
  app.listen(process.env.PORT || 4000, () => {
    console.log('Server running on port', process.env.PORT || 4000);
  });
}); 