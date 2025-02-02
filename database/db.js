const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

exports.connectToDatabase = asyncHandler(async (req, res, next) => {
  try {
    const connectionString = process.env.MONGODB_URI;
    const conn = await mongoose.connect(connectionString);
    console.log(`MongoDB has connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error Connecting to MongoDB: ", error);
  }
  next();
});
