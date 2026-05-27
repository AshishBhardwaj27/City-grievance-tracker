import mongoose from "mongoose";

import { logger } from "../utils/logger.js";

const connectDB = async () => {
  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    logger.info(`✅ MongoDB connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected. Attempting reconnect...");
    });
  } catch (error) {
    logger.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
