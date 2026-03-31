import { Router } from 'express'
import passport from 'passport'
import User from '../models/User.js'

const router = Router()
const THREE_WEEKS = 1000 * 60 * 60 * 24 * 21
const DEFAULT_SESSION = 1000 * 60 * 60 * 24

// @desc    Bypass login for grading purposes
// @route   GET /api/auth/grading-login
router.get('/grading-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production')
    return res.status(404).json({ message: 'Not found' })

  try {
    const user = await User.findOne({ username: 'tiamlee' })
    if (!user)
      return res.status(404).json({ 
        message: 'Seeded user not found. Please run npm run seed.' 
      })

    req.login(user, (err) => {
      if (err) return res.status(500).json(err)
      
      req.session.save(() => {
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/explore`)
      })
    })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', (req, res, next) => {
  const remember = req.query.remember === 'true'

  res.cookie('rememberMe', remember ? 'true' : 'false', {
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
    signed: true
  })

  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
})

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=unauthorized_domain`,
  }),
  (req, res) => {
    const rememberMe = req.signedCookies.rememberMe === 'true'
    res.clearCookie('rememberMe')

    if (rememberMe) {
      req.session.cookie.maxAge = THREE_WEEKS
    } else {
      req.session.cookie.expires = undefined
      req.session.cookie.maxAge = DEFAULT_SESSION
    }

    req.session.save(() => {
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/explore`)
    })
  }
)

// @desc    Get current logged in user
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: 'Not authenticated' })

  if (req.session.cookie.maxAge && req.session.cookie.maxAge > DEFAULT_SESSION) {
    req.session.cookie.maxAge = THREE_WEEKS
    req.session.save()
  }

  res.json(req.user)
})

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.status(200).json({ message: 'Logged out' })
    })
  })
})

export default router
