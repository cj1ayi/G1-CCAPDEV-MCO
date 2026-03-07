import { Router } from 'express';
import passport from 'passport';

const router = Router();

const THREE_WEEKS = 1000 * 60 * 60 * 24 * 21;
const DEFAULT_SESSION = 1000 * 60 * 60 * 24; // 1 day

// @desc    Auth with Google (remember=true|false passed as query param)
// @route   GET /api/auth/google
router.get('/google', (req, res, next) => {
  // Store remember preference in session before redirecting to Google
  // so we can read it in the callback
  (req.session as any).rememberMe = req.query.remember === 'true';
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login?error=unauthorized_domain',
  }),
  (req, res) => {
    const rememberMe = (req.session as any).rememberMe === true;

    if (rememberMe) {
      // Extend cookie to 3 weeks, and re-extend on every visit
      req.session.cookie.maxAge = THREE_WEEKS;
    } else {
      // Browser session only — cookie dies when browser closes
      req.session.cookie.expires = undefined;
      req.session.cookie.maxAge = DEFAULT_SESSION;
    }

    req.session.save(() => {
      res.redirect('http://localhost:5173/explore');
    });
  }
);

// @desc    Extend session on every visit if remember me is active
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  // If they have a long-lived cookie, re-extend it on every visit (rolling)
  if (req.session.cookie.maxAge && req.session.cookie.maxAge > DEFAULT_SESSION) {
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
