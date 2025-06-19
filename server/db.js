import mongoose from "mongoose";
import 'dotenv/config';

const connectToDb = async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ChatMateDb';

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(" MongoDB connection error:", err.message);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectToDb;
