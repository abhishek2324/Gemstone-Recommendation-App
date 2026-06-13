import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gemstoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gemstone',
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchReasons: [String],
    preferences: {
      zodiacSign: String,
      birthMonth: Number,
      favoriteColor: String,
      budget: Number,
      purpose: String,
    },
    recommendationDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Recommendation', recommendationSchema);
