const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String, default: null }, // Add this line for profile image
  currentPointBalance: { type: Number, default: 0 },
  recognizeNowBalance: { type: Number, default: 0 },
  rewardsRedeemed: { type: Number, default: 0 },
  isManagement: { type: Boolean, default: false }, // Add this line
  emblemsSent: { type: Number, default: 0 }, // Renamed from badgesGiven
  emblemsReceived: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
  joinedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema, 'users');