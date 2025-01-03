const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  currentPointBalance: { type: Number, default: 0 },
  recognizeNowBalance: { type: Number, default: 0 },
  badgesGiven: { type: Number, default: 0 },
  rewardsRedeemed: { type: Number, default: 0 },
  emblemsReceived: [
    { from: String, reason: String, date: { type: Date, default: Date.now } }
  ],
  joinedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema, 'users');

