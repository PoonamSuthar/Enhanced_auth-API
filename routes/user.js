const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const keys = require('../config/keys');


// Get Profile
router.get('/profile', (req, res) => {
  User.findById(req.userId).then(user => {
    console.log(req.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  });
});

// Update Profile
router.put('/profile', upload.single('photo'), (req, res) => {
  User.findById(req.userId).then(user => {
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const { name, bio, phone, email, password, isPublic } = req.body;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (password) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save().then(updatedUser => res.json(updatedUser));
        });
      });
    } else {
      if (req.file) user.photo = req.file.path;
      user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;
      user.save().then(updatedUser => res.json(updatedUser));
    }
  });
});

// View Users
router.get('/users', (req, res) => {
  User.findById(req.userId).then(requestingUser => {
    if (!requestingUser) return res.status(404).json({ msg: 'User not found' });
    const query = requestingUser.isAdmin ? {} : { isPublic: true };
    User.find(query).then(users => res.json(users));
  });
});

module.exports = router;
