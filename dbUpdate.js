const mongoose = require("mongoose");

const MONGO_URI =
  "get uri from ENV";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Define the script
const updateUsers = async () => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection("users");

    // Update missing fields one by one to ensure no overwrites
    const updates = [
      { field: "profileImage", value: null },
      { field: "currentPointBalance", value: 0 },
      { field: "recognizeNowBalance", value: 0 },
      { field: "emblemsSent", value: 0 },
      { field: "rewardsRedeemed", value: 0 },
      { field: "isManagement", value: false },
      { field: "emblemsReceived", value: [] },
      { field: "joinedDate", value: new Date() },
    ];

    let totalUpdated = 0;

    for (const { field, value } of updates) {
      const result = await collection.updateMany(
        { [field]: { $exists: false } }, // Only match documents where the field doesn't exist
        { $set: { [field]: value } } // Add the field with the default value
      );
      console.log(
        `${result.modifiedCount} documents updated for field "${field}".`
      );
      totalUpdated += result.modifiedCount;
    }

    console.log(`Total fields updated across all documents: ${totalUpdated}`);
  } catch (error) {
    console.error("Error updating users:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await updateUsers();
};

runScript();
