import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import connectDB from './config/db.js'
import './config/passport.js'

import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import spaceRoutes from './routes/spaceRoutes.js'
import voteRoutes from './routes/voteRoutes.js'
import userRoutes from './routes/userRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import searchRoutes from './routes/searchRoutes.js'

dotenv.config()

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret)
  throw new Error('SESSION_SECRET is required')

const app = express()

app.set('trust proxy', 1)

connectDB()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser(sessionSecret))

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://open.spotify.com"],
      frameAncestors: ["'none'"],
    }
  }
}))
app.use(mongoSanitize())

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' }
}))

app.use('/api/search', rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many search requests, please slow down' }
}))

app.use('/api/auth/google', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later' }
}))

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/spaces', spaceRoutes)
app.use('/api/votes', voteRoutes)
app.use('/api/users', userRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/search', searchRoutes)

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  const isDev = process.env.NODE_ENV !== 'production'
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'Internal server error'
  })
})

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist')
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
} else {
  app.get('/', (_req, res) => {
    res.send('AnimoSpaces API is running...')
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
