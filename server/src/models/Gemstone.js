import mongoose from 'mongoose';

const gemstoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Gemstone name is required'],
      unique: true,
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Gemstone color is required'],
      trim: true,
    },
    zodiacSigns: [
      {
        type: String,
        enum: [
          'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
        ],
      },
    ],
    birthMonths: [
      {
        type: Number,
        min: 1,
        max: 12,
      },
    ],
    purposes: [
      {
        type: String,
        enum: ['career', 'wealth', 'health', 'love', 'education', 'protection', 'spiritual'],
      },
    ],
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    benefits: [String],
    image: {
      type: String,
      default: '/images/default-gemstone.jpg',
    },
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    category: {
      type: String,
      enum: ['precious', 'semi-precious', 'organic'],
      required: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

// Text index for search
gemstoneSchema.index({ name: 'text', description: 'text', color: 'text' });

export default mongoose.model('Gemstone', gemstoneSchema);
