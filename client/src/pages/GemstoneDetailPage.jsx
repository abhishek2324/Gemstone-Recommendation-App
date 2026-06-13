import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gemstoneAPI } from '../services/api';
import PageLayout from '../components/PageLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { IoSparkles, IoCalendar, IoCheckmarkCircle } from 'react-icons/io5';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import { handleImageError } from '../utils/imageFallback';
import toast from 'react-hot-toast';

const GemstoneDetailPage = () => {
  const { id } = useParams();
  const [gemstone, setGemstone] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGemstone = useCallback(async () => {
    setLoading(true);
    try {
      const res = await gemstoneAPI.getById(id);
      setGemstone(res.data.data);
    } catch {
      toast.error('Failed to load gemstone details');
      setGemstone(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGemstone();
  }, [fetchGemstone]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!gemstone) {
    return (
      <PageLayout size="narrow" className="flex flex-col items-center justify-center">
        <h2 className="font-outfit font-bold text-2xl md:text-3xl text-text-primary mb-6">Gemstone not found</h2>
        <Link to="/catalog" className="btn-primary">Back to Catalog</Link>
      </PageLayout>
    );
  }

  return (
    <PageLayout size="wide">
      <Link to="/catalog" className="inline-flex items-center gap-2 text-gem-400 hover:text-gem-300 font-medium mb-10 transition-colors">
        <FaArrowLeft /> Back to Catalog
      </Link>

      <div className="card-glass-lg overflow-hidden !p-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-10 p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden h-80 md:h-[480px] relative shadow-2xl"
          >
            <img
              src={gemstone.image}
              alt={gemstone.name}
              className="w-full h-full object-cover"
              onError={(e) => handleImageError(e, gemstone.name, 500)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between py-2"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="px-4 py-2 rounded-full bg-gem-500/20 text-gem-300 text-sm font-bold capitalize">
                  {gemstone.category}
                </span>
                <div className="flex items-center gap-2 text-gold-400">
                  <FaStar />
                  <span className="font-bold">{gemstone.rating} / 5</span>
                </div>
              </div>

              <h1 className="font-outfit font-extrabold text-4xl md:text-5xl text-text-primary mb-3">
                {gemstone.name}
              </h1>
              <p className="text-text-muted text-base capitalize mb-8">Color: {gemstone.color}</p>

              <p className="text-text-secondary text-base leading-relaxed mb-8">
                {gemstone.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div className="p-5 rounded-2xl bg-surface-light/40 border border-border-subtle">
                  <h4 className="font-outfit font-semibold text-sm text-text-primary flex items-center gap-2 mb-2.5">
                    <IoSparkles className="text-gold-400" /> Compatible Zodiac
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {gemstone.zodiacSigns?.join(', ') || 'All Signs'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-surface-light/40 border border-border-subtle">
                  <h4 className="font-outfit font-semibold text-sm text-text-primary flex items-center gap-2 mb-2.5">
                    <IoCalendar className="text-gem-400" /> Birth Months
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {gemstone.birthMonths?.map((m) => new Date(2026, m - 1).toLocaleString('default', { month: 'long' })).join(', ') || 'Any month'}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="font-outfit font-semibold text-lg text-text-primary mb-4">Metaphysical Benefits</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gemstone.benefits?.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2.5 text-text-secondary text-sm">
                      <IoCheckmarkCircle className="text-emerald-400 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1.5">Estimated Price Range</p>
                <p className="text-gold-400 font-outfit font-bold text-2xl md:text-3xl">
                  ₹{gemstone.priceRange?.min?.toLocaleString()} - ₹{gemstone.priceRange?.max?.toLocaleString()}
                </p>
              </div>
              <Link to="/recommend" className="btn-primary flex items-center justify-center gap-2 !py-3.5 !px-6">
                <IoSparkles /> Match Me
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GemstoneDetailPage;
