const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
  try {
    // Log the user object to inspect it
    console.log('Google profile:', req.user);
    console.log('email: ', req.user.email);

    // // Extract necessary fields from the user profile
    // const { id, displayName, emails, photos, provider } = req.user;
    
    // if (!emails || emails.length === 0) {
    //   throw new Error('No email returned from Google');
    // }

    const email = req.user.email;
    // const photo = photos && photos.length > 0 ? photos[0].value : null;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user
      user = new User({
        name: req.user.name,
        email,
        photo: req.user.photo,
        provider: req.user.provider,
        providerId: req.user.providerId
      });

      await user.save();
    }

    // Generate token
    const payload = { id: user.id, name: user.name };
    const token = jwt.sign(payload, keys.jwtSecret, { expiresIn: 3600 });

    // Attach token to response headers
    res.set('Authorization', `Bearer ${token}`);
    res.redirect('/user/profile');
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
