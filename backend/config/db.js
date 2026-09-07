import dns from "node:dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Fix DNS issues with MongoDB Atlas in Nigeria
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load environment variables
dotenv.config();

const mongoUrl =
  process.env.MONGO_DB_URL || process.env.MONGO_URL || process.env.MONGO_URI;

const connectDB = async () => {
  if (!mongoUrl) {
    console.error(
      "❌ MONGO DB Connection Error: MONGO_DB_URL, MONGO_URL, or MONGO_URI is not defined in .env",
    );
    process.exit(1);
  }

  try {
    const DB = await mongoose.connect(mongoUrl);
    console.log(`✅ CONNECTED TO DATABASE: ${DB.connection.name}`);
    return DB;
  } catch (error) {
    console.error("❌ MONGO DB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
