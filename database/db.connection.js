import mongoose from 'mongoose';
import { envConfig } from '../config/env.js';

/**
 * Connects to the MongoDB database using Mongoose and performs seed operation.
 * @async
 * @returns {Promise<void>} A Promise that resolves when the connection and seed operation are complete.
 */
const connect = async () => {
  try {
    await mongoose.connect(envConfig.MONGO_URL, {
      authSource: 'admin',
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

export default connect;