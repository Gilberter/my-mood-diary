// src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.DATABASE_URL;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);

    console.log('MongoDB connected successfully!');
  } catch (error: any) {
    console.error('MongoDB connection error:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;