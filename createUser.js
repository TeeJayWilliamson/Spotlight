const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://trevorjwilliamson:DPKiDCeTtjikih65@ttccluster.u6ybt.mongodb.net/spotlightTTC?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

  .then(() => {
    // Update the schema to include isManagement
    const User = mongoose.model('User', {
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      name: { type: String, required: true },
      email: { type: String, required: true },
      isManagement: { type: Boolean, default: false }, // New field
    });

    const createUser = async () => {
      const username = '71500';
      const password = 'password'; // Plaintext password
      const name = 'Kenneth Dias';
      const email = 'kenneth.dias@ttc.ca';
      const isManagement = true; // Assign management status

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user
      const newUser = new User({
        username,
        password: hashedPassword,
        name,
        email,
        isManagement, // Include the management status
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
