import { Router } from 'express';
import passport from 'passport';
import User from '../models/User.js';

const router = Router();
const THREE_WEEKS = 1000 * 60 * 60 * 24 * 21;
const DEFAULT_SESSION = 1000 * 60 * 60 * 24; // 1 day

// @desc    Bypass login for grading purposes
// @route   GET /api/auth/grading-login
router.get('/grading-login', async (req, res) => {
  try {
    const user = await User.findOne({ username: 'tiamlee' });
    if (!user) {
      return res.status(404).json({ message: 'Seeded user not found' });
    }

    req.login(user, (err) => {
      if (err) return res.status(500).json(err);
      res.redirect('http://localhost:5173/explore');
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Auth with Google (remember=true|false passed as query param)
// @route   GET /api/auth/google
router.get('/google', (req, res, next) => {
  const remember = req.query.remember === 'true';

  // Store remember preference in a short-lived signed cookie that survives
  // the OAuth round trip we can't use the session here because passport
  // regenerates the session after OAuth completes (security measure),
  // which would wipe anything stored before the redirect.
  res.cookie('rememberMe', remember ? 'true' : 'false', {
    maxAge: 5 * 60 * 1000, // 5 minutes — just enough for the OAuth flow
    httpOnly: true,
    signed: true
  });

  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  );
});

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    // If domain verification fails, redirect to login with an error flag
    failureRedirect: 'http://localhost:5173/login?error=unauthorized_domain',
  }),
  (req, res) => {
    // Read the remember preference from the signed cookie set before redirect
    // (session-based storage doesn't work here — see comment above)
    const rememberMe = req.signedCookies.rememberMe === 'true';
    res.clearCookie('rememberMe');

    if (rememberMe) {
      // Extend cookie to 3 weeks, re-extended on every visit via rolling: true
      req.session.cookie.maxAge = THREE_WEEKS;
    } else {
      // Default 1 day session
      req.session.cookie.expires = undefined;
      req.session.cookie.maxAge = DEFAULT_SESSION;
    }

    req.session.save(() => {
      res.redirect('http://localhost:5173/explore');
    });
  }
);

// @desc    Get current logged in user
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // If they have a long-lived cookie, re-extend it on every visit (rolling)
  if (
    req.session.cookie.maxAge &&
    req.session.cookie.maxAge > DEFAULT_SESSION
  ) {
    req.session.cookie.maxAge = THREE_WEEKS;
    req.session.save();
  }

  res.json(req.user);
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out' });
    });
  });
});

export default router;
