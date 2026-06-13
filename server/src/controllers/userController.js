import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, zodiacSign, birthMonth, favoriteColor } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, zodiacSign, birthMonth, favoriteColor },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user recommendation history
// @route   GET /api/users/history
export const getRecommendationHistory = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.user._id })
      .populate('gemstoneId')
      .sort('-recommendationDate');

    res.json({ success: true, data: recommendations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin user' });
    }

    await Recommendation.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
