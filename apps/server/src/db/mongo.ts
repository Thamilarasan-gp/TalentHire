import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { seedAtlasIfNeeded } from './seedAtlas';

dotenv.config();

// Fix Windows Node.js querySrv ECONNREFUSED issue by using public reliable DNS resolvers for SRV lookups
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS cannot be set
}

/**
 * Connect to MongoDB Atlas
 */
export async function connectMongo(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB Atlas] No MONGODB_URI provided in environment variables.');
    return false;
  }

  try {
    console.log('[MongoDB Atlas] Connecting to MongoDB Atlas cluster...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('[MongoDB Atlas] ✅ Connected successfully to MongoDB Atlas (database: anthurium)!');

    // Run auto-seeder if collections are new
    await seedAtlasIfNeeded();
    return true;
  } catch (error: any) {
    console.error('[MongoDB Atlas] ❌ Failed to connect to MongoDB Atlas:', error.message || error);
    return false;
  }
}
