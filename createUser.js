const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://trevorjwilliamson:DPKiDCeTtjikih65@ttccluster.u6ybt.mongodb.net/spotlightTTC?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(() => {
    const User = mongoose.model('User', {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
    });

    const createUser = async () => {
      const username = '68503';
      const password = 'password'; // Plaintext password
      const name = 'Joseph Sturino';
      const email = 'joseph.sturino@ttc.ca';

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user
      const newUser = new User({
        username,
        password: hashedPassword,
        name,
        email,
      });

      try {
        await newUser.save();
        console.log('User created');
      } catch (err) {
        console.error('Error creating user:', err.message);
      } finally {
        mongoose.connection.close();
      }
    };

    createUser();
  })
  .catch((err) => console.error('MongoDB connection error:', err));
