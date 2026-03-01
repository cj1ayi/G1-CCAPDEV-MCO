import { Router } from 'express';
import passport from 'passport';

const router = Router();

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    // If domain verification fails, redirect to login with an error flag
    failureRedirect: 'http://localhost:5173/login?error=unauthorized_domain',
  }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:5173/explore');
  }
);

// @desc    Get current logged in user
// @route   GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie('connect.sid'); 
    res.status(200).json({ message: 'Logged out' });
  });
});

export default router;
