import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Gemstone from '../models/Gemstone.js';
import Recommendation from '../models/Recommendation.js';
import { gemstones, users } from './seedData.js';

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Gemstone.deleteMany();
    await Recommendation.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Seed users
    const createdUsers = await User.create(users);
    console.log(`👤 Created ${createdUsers.length} users`);

    // Seed gemstones
    const createdGemstones = await Gemstone.create(gemstones);
    console.log(`💎 Created ${createdGemstones.length} gemstones`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@gemstone.com / admin123');
    console.log('📧 User login: user@gemstone.com / user123');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany();
    await Gemstone.deleteMany();
    await Recommendation.deleteMany();
    console.log('🗑️  Database cleared!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  clearDB();
} else {
  seedDB();
}
