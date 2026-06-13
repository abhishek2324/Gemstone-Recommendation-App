// Rule-based Gemstone Recommendation Engine
// Scores gemstones based on zodiac, birth month, color, purpose, and budget

const ZODIAC_GEMSTONE_MAP = {
  Aries: ['Diamond', 'Bloodstone', 'Red Coral'],
  Taurus: ['Emerald', 'Rose Quartz', 'Lapis Lazuli'],
  Gemini: ['Pearl', 'Agate', 'Citrine'],
  Cancer: ['Ruby', 'Moonstone', 'Pearl'],
  Leo: ['Peridot', 'Onyx', 'Ruby'],
  Virgo: ['Blue Sapphire', 'Carnelian', 'Peridot'],
  Libra: ['Opal', 'Tourmaline', 'Lapis Lazuli'],
  Scorpio: ['Topaz', 'Citrine', 'Garnet'],
  Sagittarius: ['Turquoise', 'Tanzanite', 'Amethyst'],
  Capricorn: ['Garnet', 'Lapis Lazuli', 'Onyx'],
  Aquarius: ['Amethyst', 'Aquamarine', 'Turquoise'],
  Pisces: ['Yellow Sapphire', 'Jade', 'Aquamarine'],
};

const BIRTH_MONTH_GEMSTONE_MAP = {
  1: ['Garnet'],
  2: ['Amethyst'],
  3: ['Aquamarine', 'Bloodstone'],
  4: ['Diamond'],
  5: ['Emerald'],
  6: ['Pearl', 'Moonstone'],
  7: ['Ruby'],
  8: ['Peridot'],
  9: ['Blue Sapphire'],
  10: ['Opal', 'Tourmaline'],
  11: ['Topaz', 'Citrine'],
  12: ['Turquoise', 'Tanzanite'],
};

const COLOR_MAP = {
  red: ['Ruby', 'Garnet', 'Red Coral', 'Bloodstone'],
  blue: ['Blue Sapphire', 'Aquamarine', 'Turquoise', 'Tanzanite', 'Lapis Lazuli'],
  green: ['Emerald', 'Jade', 'Peridot', 'Tourmaline'],
  purple: ['Amethyst', 'Tanzanite'],
  yellow: ['Yellow Sapphire', 'Citrine', 'Topaz'],
  white: ['Diamond', 'Pearl', 'Moonstone', 'Opal'],
  pink: ['Rose Quartz', 'Tourmaline'],
  orange: ['Carnelian', 'Citrine', 'Topaz'],
  black: ['Onyx', 'Obsidian'],
  brown: ['Tiger Eye', 'Agate'],
};

/**
 * Calculate recommendation score for a gemstone based on user preferences.
 * @param {Object} gemstone - The gemstone document
 * @param {Object} preferences - User preferences
 * @returns {{ score: number, reasons: string[] }}
 */
function calculateScore(gemstone, preferences) {
  let score = 0;
  const reasons = [];
  const { zodiacSign, birthMonth, favoriteColor, budget, purpose } = preferences;

  // Zodiac Sign Match (30 points)
  if (zodiacSign && ZODIAC_GEMSTONE_MAP[zodiacSign]) {
    const zodiacGems = ZODIAC_GEMSTONE_MAP[zodiacSign];
    if (zodiacGems.includes(gemstone.name)) {
      const index = zodiacGems.indexOf(gemstone.name);
      const zodiacScore = index === 0 ? 30 : index === 1 ? 22 : 15;
      score += zodiacScore;
      reasons.push(`${index === 0 ? 'Primary' : 'Secondary'} gemstone for ${zodiacSign}`);
    } else if (gemstone.zodiacSigns && gemstone.zodiacSigns.includes(zodiacSign)) {
      score += 10;
      reasons.push(`Compatible with ${zodiacSign}`);
    }
  }

  // Birth Month Match (20 points)
  if (birthMonth && BIRTH_MONTH_GEMSTONE_MAP[birthMonth]) {
    const monthGems = BIRTH_MONTH_GEMSTONE_MAP[birthMonth];
    if (monthGems.includes(gemstone.name)) {
      score += 20;
      reasons.push(`Birthstone for ${getMonthName(birthMonth)}`);
    } else if (gemstone.birthMonths && gemstone.birthMonths.includes(birthMonth)) {
      score += 8;
      reasons.push(`Associated with ${getMonthName(birthMonth)}`);
    }
  }

  // Color Preference Match (15 points)
  if (favoriteColor) {
    const colorKey = favoriteColor.toLowerCase();
    if (COLOR_MAP[colorKey] && COLOR_MAP[colorKey].includes(gemstone.name)) {
      score += 15;
      reasons.push(`Matches your favorite color: ${favoriteColor}`);
    } else if (gemstone.color && gemstone.color.toLowerCase().includes(colorKey)) {
      score += 10;
      reasons.push(`Similar color to your preference`);
    }
  }

  // Purpose Match (20 points)
  if (purpose && gemstone.purposes) {
    if (gemstone.purposes.includes(purpose.toLowerCase())) {
      score += 20;
      reasons.push(`Excellent for ${purpose}`);
    }
  }

  // Budget Match (15 points)
  if (budget && gemstone.priceRange) {
    if (budget >= gemstone.priceRange.min && budget >= gemstone.priceRange.max) {
      score += 15;
      reasons.push('Within your budget');
    } else if (budget >= gemstone.priceRange.min) {
      score += 10;
      reasons.push('Partially within your budget');
    } else {
      // Slight penalty but don't exclude
      score += 2;
      reasons.push('Above budget — consider smaller sizes');
    }
  }

  return { score, reasons };
}

function getMonthName(month) {
  const months = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month] || '';
}

/**
 * Get gemstone recommendations based on user preferences.
 * @param {Array} gemstones - All available gemstones
 * @param {Object} preferences - User preferences
 * @param {number} topN - Number of top recommendations to return
 * @returns {Array} Scored and sorted recommendations
 */
export function getRecommendations(gemstones, preferences, topN = 5) {
  const scored = gemstones.map((gemstone) => {
    const { score, reasons } = calculateScore(gemstone, preferences);
    return {
      gemstone,
      matchScore: Math.min(score, 100),
      matchReasons: reasons,
    };
  });

  // Sort by score descending, filter out zero-score
  return scored
    .filter((item) => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, topN);
}

export { ZODIAC_GEMSTONE_MAP, BIRTH_MONTH_GEMSTONE_MAP, COLOR_MAP };
