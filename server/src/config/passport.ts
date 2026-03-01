import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.CALLBACK_URL!,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // 1. Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // 2. If not, create a new user
      // We generate a username from the email prefix
      const email = profile.emails?.[0].value || '';
      const baseUsername = email.split('@')[0];
      
      user = await User.create({
        googleId: profile.id,
        email: email,
        username: `${baseUsername}_${Math.floor(Math.random() * 1000)}`,
        displayName: profile.displayName,
        avatar: profile.photos?.[0].value,
        joinedAt: new Date()
      });

      return done(null, user);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }
));

// Session support ahh
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
