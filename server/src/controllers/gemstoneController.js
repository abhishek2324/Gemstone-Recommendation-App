import Gemstone from '../models/Gemstone.js';

// @desc    Get all gemstones with search, filter, pagination
// @route   GET /api/gemstones
export const getAllGemstones = async (req, res, next) => {
  try {
    const { search, color, category, purpose, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } },
      ];
    }

    if (color) query.color = { $regex: color, $options: 'i' };
    if (category) query.category = category;
    if (purpose) query.purposes = { $in: [purpose] };

    if (minPrice || maxPrice) {
      query['priceRange.min'] = { $lte: Number(maxPrice) || 999999 };
      query['priceRange.max'] = { $gte: Number(minPrice) || 0 };
    }

    const total = await Gemstone.countDocuments(query);
    const gemstones = await Gemstone.find(query)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort('name');

    res.json({
      success: true,
      count: gemstones.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      data: gemstones,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single gemstone
// @route   GET /api/gemstones/:id
export const getGemstoneById = async (req, res, next) => {
  try {
    const gemstone = await Gemstone.findById(req.params.id);
    if (!gemstone) {
      return res.status(404).json({ success: false, message: 'Gemstone not found' });
    }
    res.json({ success: true, data: gemstone });
  } catch (error) {
    next(error);
  }
};

// @desc    Create gemstone (admin)
// @route   POST /api/gemstones
export const createGemstone = async (req, res, next) => {
  try {
    const gemstone = await Gemstone.create(req.body);
    res.status(201).json({ success: true, data: gemstone });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gemstone (admin)
// @route   PUT /api/gemstones/:id
export const updateGemstone = async (req, res, next) => {
  try {
    const gemstone = await Gemstone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!gemstone) {
      return res.status(404).json({ success: false, message: 'Gemstone not found' });
    }
    res.json({ success: true, data: gemstone });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gemstone (admin)
// @route   DELETE /api/gemstones/:id
export const deleteGemstone = async (req, res, next) => {
  try {
    const gemstone = await Gemstone.findByIdAndDelete(req.params.id);
    if (!gemstone) {
      return res.status(404).json({ success: false, message: 'Gemstone not found' });
    }
    res.json({ success: true, message: 'Gemstone deleted successfully' });
  } catch (error) {
    next(error);
  }
};
