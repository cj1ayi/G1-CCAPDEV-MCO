import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import connectDB from './config/db.js';
import './config/passport.js';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import spaceRoutes from './routes/spaceRoutes.js';
import voteRoutes from './routes/voteRoutes.js';
import userRoutes from './routes/userRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import searchRoutes from './routes/searchRoutes.js'

dotenv.config();

const app = express();

// Trust Render's reverse proxy so secure cookies work in production
app.set('trust proxy', 1);

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Cookie parser — required for signed rememberMe cookie in auth flow
app.use(cookieParser(process.env.SESSION_SECRET));

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Extends session on every visit
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day default — overridden by rememberMe in authRoutes
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/search', searchRoutes)

const PORT = process.env.PORT || 3000;

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.send('AnimoSpaces API is running...');
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
