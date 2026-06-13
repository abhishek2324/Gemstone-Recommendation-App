import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { recommendationAPI } from '../services/api';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { IoSparkles, IoDiamond, IoCheckmarkCircle } from 'react-icons/io5';
import { FaArrowRight, FaArrowLeft, FaBookmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { handleImageError } from '../utils/imageFallback';
import toast from 'react-hot-toast';

const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const zodiacEmojis = { Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓' };
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'White', 'Pink', 'Orange', 'Black', 'Brown'];
const colorClasses = { Red: 'bg-red-500', Blue: 'bg-blue-500', Green: 'bg-emerald-500', Yellow: 'bg-yellow-400', Purple: 'bg-purple-500', White: 'bg-white', Pink: 'bg-pink-500', Orange: 'bg-orange-500', Black: 'bg-gray-800', Brown: 'bg-amber-700' };
const purposes = [
  { value: 'career', label: 'Career', icon: '💼' },
  { value: 'wealth', label: 'Wealth', icon: '💰' },
  { value: 'health', label: 'Health', icon: '❤️' },
  { value: 'love', label: 'Love', icon: '💕' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'protection', label: 'Protection', icon: '🛡️' },
  { value: 'spiritual', label: 'Spiritual', icon: '🧘' },
];

const RecommendationPage = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [saving, setSaving] = useState({});
  const [preferences, setPreferences] = useState({
    zodiacSign: user?.zodiacSign || '',
    birthMonth: user?.birthMonth || '',
    favoriteColor: user?.favoriteColor || '',
    budget: '',
    purpose: '',
  });

  const totalSteps = 5;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        ...preferences,
        birthMonth: preferences.birthMonth ? Number(preferences.birthMonth) : undefined,
        budget: preferences.budget ? Number(preferences.budget) : undefined,
      };
      const res = await recommendationAPI.generate(payload);
      setResults(res.data.data);
      setStep(6);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (rec) => {
    setSaving((prev) => ({ ...prev, [rec.gemstone._id]: true }));
    try {
      await recommendationAPI.save({
        gemstoneId: rec.gemstone._id,
        matchScore: rec.matchScore,
        matchReasons: rec.matchReasons,
        preferences,
      });
      toast.success(`${rec.gemstone.name} saved to your history!`);
      setSaving((prev) => ({ ...prev, [rec.gemstone._id]: 'saved' }));
    } catch (err) {
      toast.error('Failed to save');
      setSaving((prev) => ({ ...prev, [rec.gemstone._id]: false }));
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return preferences.zodiacSign;
      case 2: return preferences.birthMonth;
      case 3: return preferences.favoriteColor;
      case 4: return preferences.budget;
      case 5: return preferences.purpose;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="font-outfit font-bold text-2xl text-text-primary mb-2">What's your Zodiac Sign?</h2>
            <p className="text-text-muted mb-6">Select the zodiac sign that matches your birth date</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {zodiacSigns.map((sign) => (
                <button
                  key={sign}
                  onClick={() => setPreferences({ ...preferences, zodiacSign: sign })}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    preferences.zodiacSign === sign
                      ? 'bg-gradient-accent text-white glow-purple'
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl block mb-1">{zodiacEmojis[sign]}</span>
                  <span className="text-xs font-medium">{sign}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="font-outfit font-bold text-2xl text-text-primary mb-2">Birth Month</h2>
            <p className="text-text-muted mb-6">Select your birth month for birthstone matching</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {months.map((month, i) => (
                <button
                  key={month}
                  onClick={() => setPreferences({ ...preferences, birthMonth: i + 1 })}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    preferences.birthMonth === i + 1
                      ? 'bg-gradient-accent text-white glow-purple'
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg font-bold block mb-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs text-text-muted">{month.slice(0, 3)}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="font-outfit font-bold text-2xl text-text-primary mb-2">Favorite Color</h2>
            <p className="text-text-muted mb-6">Choose the color that resonates with you</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setPreferences({ ...preferences, favoriteColor: color })}
                  className={`p-4 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                    preferences.favoriteColor === color
                      ? 'bg-gradient-accent text-white glow-purple'
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${colorClasses[color]} ring-2 ring-white/20 shrink-0`} />
                  <span className="text-sm font-medium">{color}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="font-outfit font-bold text-2xl text-text-primary mb-2">Your Budget</h2>
            <p className="text-text-muted mb-6">What's your budget range? (in ₹)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[5000, 10000, 25000, 50000, 100000, 500000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, budget: amount })}
                  className={`p-4 rounded-xl text-center transition-all duration-200 ${
                    preferences.budget === amount
                      ? 'bg-gradient-gold text-surface font-bold glow-gold'
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg font-semibold">₹{amount.toLocaleString()}</span>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="number"
                placeholder="Or enter custom amount"
                value={typeof preferences.budget === 'number' && ![5000, 10000, 25000, 50000, 100000, 500000].includes(preferences.budget) ? preferences.budget : ''}
                onChange={(e) => setPreferences({ ...preferences, budget: Number(e.target.value) || '' })}
                className="input-gem"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="font-outfit font-bold text-2xl text-text-primary mb-2">Life Purpose</h2>
            <p className="text-text-muted mb-6">What do you want the gemstone to help with?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {purposes.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPreferences({ ...preferences, purpose: p.value })}
                  className={`p-5 rounded-xl flex items-center gap-4 text-left transition-all duration-200 ${
                    preferences.purpose === p.value
                      ? 'bg-gradient-accent text-white glow-purple'
                      : 'glass hover:bg-white/5'
                  }`}
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-outfit font-semibold text-lg">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (step === 6 && results) {
    return (
      <PageLayout size="wide">
        <PageHeader
          badge="Results"
          title="Your Recommendations"
          subtitle="Based on your preferences, here are your top gemstone matches"
        />

        {results.length > 0 ? (
          <div className="space-y-6 md:space-y-8">
            {results.map((rec, i) => (
              <motion.div
                key={rec.gemstone._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-glass-lg overflow-hidden !p-0"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-72 h-56 md:h-auto relative shrink-0">
                    <img
                      src={rec.gemstone.image}
                      alt={rec.gemstone.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => handleImageError(e, rec.gemstone.name, 256)}
                    />
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-gradient-accent text-white text-sm font-bold">
                          #{i + 1}
                        </div>
                      </div>

                      <div className="flex-1 p-6 md:p-8">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-outfit font-bold text-2xl text-text-primary">{rec.gemstone.name}</h3>
                            <p className="text-text-muted text-sm capitalize">{rec.gemstone.category} • {rec.gemstone.color}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-outfit font-bold ${rec.matchScore >= 50 ? 'text-emerald-400' : rec.matchScore >= 30 ? 'text-gold-400' : 'text-text-muted'}`}>
                              {rec.matchScore}%
                            </div>
                            <p className="text-text-muted text-xs">Match Score</p>
                          </div>
                        </div>

                        <div className="w-full h-2 bg-surface rounded-full mb-4 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rec.matchScore}%` }}
                            transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                            className={`h-full rounded-full ${rec.matchScore >= 50 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-gold-500 to-gold-400'}`}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {rec.matchReasons.map((reason, j) => (
                            <span key={j} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gem-500/10 text-gem-300 text-xs">
                              <IoCheckmarkCircle className="text-emerald-400" />
                              {reason}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gold-400 font-outfit font-semibold">
                            ₹{rec.gemstone.priceRange?.min?.toLocaleString()} - ₹{rec.gemstone.priceRange?.max?.toLocaleString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSave(rec)}
                              disabled={saving[rec.gemstone._id] === 'saved' || saving[rec.gemstone._id] === true}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                saving[rec.gemstone._id] === 'saved'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'btn-secondary !py-2 !px-4'
                              }`}
                            >
                              {saving[rec.gemstone._id] === 'saved' ? (
                                <><IoCheckmarkCircle /> Saved</>
                              ) : saving[rec.gemstone._id] ? (
                                <div className="w-4 h-4 border-2 border-gem-400/30 border-t-gem-400 rounded-full animate-spin" />
                              ) : (
                                <><FaBookmark className="text-xs" /> Save</>
                              )}
                            </button>
                            <Link to={`/gemstone/${rec.gemstone._id}`} className="btn-primary !py-2 !px-4 text-sm">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card-glass-lg text-center py-16">
                <IoDiamond className="text-6xl text-gem-700 mx-auto mb-5" />
                <h3 className="font-outfit font-semibold text-xl md:text-2xl text-text-primary mb-3">No matching gemstones found</h3>
                <p className="text-text-muted mb-6">Try adjusting your preferences for better results.</p>
              </div>
            )}

        <div className="text-center mt-10">
          <button onClick={() => { setStep(1); setResults(null); }} className="btn-secondary">
            Try Different Preferences
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout size="narrow">
      <PageHeader
        badge="Wizard"
        title="Get Your Recommendation"
        subtitle="Answer a few questions to discover gemstones matched to your profile"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-text-muted text-sm font-medium">Step {step} of {totalSteps}</span>
            <span className="text-gem-400 text-sm font-semibold">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-card rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              className="h-full bg-gradient-accent rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="card-glass-lg mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="btn-secondary flex items-center gap-2 disabled:opacity-30"
            >
              <FaArrowLeft className="text-xs" /> Back
            </button>

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="btn-primary flex items-center gap-2"
              >
                Next <FaArrowRight className="text-xs" />
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={loading || !canProceed()}
                className="btn-gold flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-surface/30 border-t-surface rounded-full animate-spin" />
                ) : (
                  <>
                    <IoSparkles /> Get Recommendations
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </PageLayout>
    );
};

export default RecommendationPage;
