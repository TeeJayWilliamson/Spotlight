const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://trevorjwilliamson:Teejay123@ttccluster.u6ybt.mongodb.net/spotlightTTC?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => {
    console.log('Connected to MongoDB');

    // Full schema
    const UserSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      profileImage: { type: String, default: null },
      currentPointBalance: { type: Number, default: 0 },
      recognizeNowBalance: { type: Number, default: 0 },
      rewardsRedeemed: { type: Number, default: 0 },
      isManagement: { type: Boolean, default: false },
      emblemsSent: { type: Number, default: 0 }, // Renamed from badgesGiven
      emblemsReceived: [
        { from: String, reason: String, date: { type: Date, default: Date.now } }
      ],
      joinedDate: { type: Date, default: Date.now },
    });

    const User = mongoose.model('User', UserSchema, 'users');

    const createUser = async () => {
      const username = 'badge number';
      const password = 'password'; // Plaintext password
      const name = 'First and Last Name';
      const email = 'Employee Email';
      const isManagement = false;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create and save the new user
      const newUser = new User({
        username,
        password: hashedPassword,
        name,
        email,
        profileImage: null,
        currentPointBalance: 0,
        recognizeNowBalance: 0,
        badgesGiven: 0,
        rewardsRedeemed: 0,
        isManagement,
        emblemsReceived: [],
        joinedDate: new Date(),
      });

      try {
        await newUser.save();
        console.log('User created successfully');
      } catch (err) {
        console.error('Error creating user:', err.message);
      } finally {
        mongoose.connection.close();
      }
    };

    createUser();
  })
  .catch((err) => console.error('MongoDB connection error:', err));
