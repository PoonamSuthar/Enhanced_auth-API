const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  photo: { type: String },
  bio: { type: String },
  phone: { type: String },
  isAdmin: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true },
  provider: { type: String },
  providerId: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
