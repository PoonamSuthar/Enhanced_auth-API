const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const keys = require('./keys');

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email }).then(user => {
    if (!user) return done(null, false, { message: 'No user found' });
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) return done(null, user);
      else return done(null, false, { message: 'Incorrect password' });
    });
  });
}));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ providerId: profile.id }).then(user => {
    if (user) return done(null, user);
    new User({
      provider: 'google',
      providerId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value
    }).save().then(newUser => done(null, newUser));
  });
}));    

// // Facebook Strategy
// passport.use(new FacebookStrategy({
//   clientID: keys.facebookClientID,
//   clientSecret: keys.facebookClientSecret,
//   callbackURL: '/auth/facebook/callback',
//   profileFields: ['id', 'emails', 'name', 'photos']
// }, (accessToken, refreshToken, profile, done) => {
//   User.findOne({ providerId: profile.id }).then(user => {
//     if (user) return done(null, user);
//     new User({
//       provider: 'facebook',
//       providerId: profile.id,
//       name: `${profile.name.givenName} ${profile.name.familyName}`,
//       email: profile.emails[0].value,
//       photo: profile.photos[0].value
//     }).save().then(newUser => done(null, newUser));
//   });
// }));

// // Twitter Strategy
// passport.use(new TwitterStrategy({
//   consumerKey: keys.twitterConsumerKey,
//   consumerSecret: keys.twitterConsumerSecret,
//   callbackURL: '/auth/twitter/callback',
//   includeEmail: true
// }, (token, tokenSecret, profile, done) => {
//   User.findOne({ providerId: profile.id }).then(user => {
//     if (user) return done(null, user);
//     new User({
//       provider: 'twitter',
//       providerId: profile.id,
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       photo: profile.photos[0].value
//     }).save().then(newUser => done(null, newUser));
//   });
// }));

// // GitHub Strategy
// passport.use(new GitHubStrategy({
//   clientID: keys.githubClientID,
//   clientSecret: keys.githubClientSecret,
//   callbackURL: '/auth/github/callback'
// }, (accessToken, refreshToken, profile, done) => {
//   User.findOne({ providerId: profile.id }).then(user => {
//     if (user) return done(null, user);
//     new User({
//       provider: 'github',
//       providerId: profile.id,
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       photo: profile.photos[0].value
//     }).save().then(newUser => done(null, newUser));
//   });
// }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

module.exports = passport;