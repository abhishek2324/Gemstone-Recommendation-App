import Gemstone from '../models/Gemstone.js';
import Recommendation from '../models/Recommendation.js';
import User from '../models/User.js';
import { getRecommendations } from '../utils/recommendationEngine.js';

// @desc    Generate recommendations based on preferences
// @route   POST /api/recommendations
export const generateRecommendations = async (req, res, next) => {
  try {
    const { zodiacSign, birthMonth, favoriteColor, budget, purpose } = req.body;

    if (!zodiacSign && !birthMonth && !favoriteColor && !budget && !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one preference',
      });
    }

    const gemstones = await Gemstone.find();
    const preferences = { zodiacSign, birthMonth, favoriteColor, budget, purpose };
    const recommendations = getRecommendations(gemstones, preferences, 6);

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a recommendation to user history
// @route   POST /api/recommendations/save
export const saveRecommendation = async (req, res, next) => {
  try {
    const { gemstoneId, matchScore, matchReasons, preferences } = req.body;

    const recommendation = await Recommendation.create({
      userId: req.user._id,
      gemstoneId,
      matchScore,
      matchReasons,
      preferences,
    });

    // Add to user's history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { recommendationHistory: recommendation._id },
    });

    res.status(201).json({ success: true, data: recommendation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommendation statistics (admin)
// @route   GET /api/recommendations/stats
export const getStats = async (req, res, next) => {
  try {
    const totalRecommendations = await Recommendation.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalGemstones = await Gemstone.countDocuments();

    // Most recommended gemstones
    const topGemstones = await Recommendation.aggregate([
      { $group: { _id: '$gemstoneId', count: { $sum: 1 }, avgScore: { $avg: '$matchScore' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'gemstones',
          localField: '_id',
          foreignField: '_id',
          as: 'gemstone',
        },
      },
      { $unwind: '$gemstone' },
      {
        $project: {
          name: '$gemstone.name',
          color: '$gemstone.color',
          image: '$gemstone.image',
          count: 1,
          avgScore: { $round: ['$avgScore', 1] },
        },
      },
    ]);

    // Most popular purposes
    const topPurposes = await Recommendation.aggregate([
      { $group: { _id: '$preferences.purpose', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Recent recommendations
    const recentRecommendations = await Recommendation.find()
      .populate('userId', 'name email')
      .populate('gemstoneId', 'name color')
      .sort('-createdAt')
      .limit(10);

    res.json({
      success: true,
      data: {
        totalRecommendations,
        totalUsers,
        totalGemstones,
        topGemstones,
        topPurposes,
        recentRecommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};
