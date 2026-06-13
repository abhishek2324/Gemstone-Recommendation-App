import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';
import { IoDiamond, IoSparkles, IoTime, IoPersonCircle } from 'react-icons/io5';
import { FaArrowRight } from 'react-icons/fa';
import { formatMemberSince, formatDate } from '../utils/formatDate';
import { handleImageError } from '../utils/imageFallback';
import toast from 'react-hot-toast';


const DashboardPage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await userAPI.getHistory();
      setHistory(res.data.data || []);
    } catch {
      toast.error('Failed to load your recommendations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-mesh">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <PageLayout size="full">
      <PageHeader
        badge="Your Dashboard"
      title="Dashboard Overview"
        subtitle="Here's your gemstone journey overview — track recommendations, explore the catalog, and discover your next perfect match."
      />

      {/* Stats Grid */}
      <section className="page-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
          <StatsCard icon={<IoDiamond />} label="Recommendations" value={history.length} color="gem" delay={0} />
          <StatsCard icon={<IoSparkles />} label="Zodiac Sign" value={user?.zodiacSign || 'Not set'} color="gold" delay={0.1} />
          <StatsCard icon={<IoTime />} label="Member Since" value={formatMemberSince(user?.createdAt)} color="info" delay={0.2} />
          <StatsCard icon={<IoPersonCircle />} label="Role" value={user?.role === 'admin' ? 'Admin' : 'User'} color="success" delay={0.3} />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="page-section">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Link to="/recommend" className="action-card group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center">
                  <IoSparkles className="text-2xl text-white" />
                </div>
                <FaArrowRight className="text-xl text-text-muted group-hover:text-gem-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-outfit font-semibold text-xl md:text-2xl text-text-primary mb-3">Get New Recommendation</h3>
              <p className="text-text-muted text-base leading-relaxed">
                Share your preferences and discover your perfect gemstone match.
              </p>
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Link to="/catalog" className="action-card group">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center">
                  <IoDiamond className="text-2xl text-surface" />
                </div>
                <FaArrowRight className="text-xl text-text-muted group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-outfit font-semibold text-xl md:text-2xl text-text-primary mb-3">Browse Catalog</h3>
              <p className="text-text-muted text-base leading-relaxed">
                Explore our complete collection of precious and semi-precious gemstones.
              </p>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Recent History */}
      <section>
        <h2 className="section-heading">Recent Recommendations</h2>
        {history.length > 0 ? (
          <div className="space-y-4 md:space-y-5">
            {history.slice(0, 5).map((rec) => (
              <div
                key={rec._id}
                className="card-glass flex flex-col sm:flex-row sm:items-center gap-5 md:gap-6 hover:border-gem-500/25 transition-colors"
              >
                <img
                  src={rec.gemstoneId?.image}
                  alt={rec.gemstoneId?.name}
                  loading="lazy"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shrink-0 mx-auto sm:mx-0"
                  onError={(e) => handleImageError(e, rec.gemstoneId?.name, 96)}
                />
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h4 className="font-outfit font-semibold text-lg md:text-xl text-text-primary mb-1.5">
                    {rec.gemstoneId?.name || 'Unknown'}
                  </h4>
                  <p className="text-text-muted text-sm md:text-base truncate">
                    {rec.matchReasons?.join(' • ') || 'No reasons available'}
                  </p>
                </div>
                <div className="text-center sm:text-right shrink-0">
                  <div className="text-gem-400 font-outfit font-bold text-2xl md:text-3xl">{rec.matchScore}%</div>
                  <div className="text-text-muted text-sm mt-1">{formatDate(rec.recommendationDate)}</div>
                </div>
              </div>
            ))}
            {history.length > 5 && (
              <Link
                to="/history"
                className="block text-center text-gem-400 hover:text-gem-300 text-base font-medium py-4 transition-colors"
              >
                View all {history.length} recommendations →
              </Link>
            )}
          </div>
        ) : (
          <EmptyState
            icon={<IoDiamond className="text-6xl text-gem-700" />}
            title="No recommendations yet"
            description="Start your gemstone journey by getting your first personalized recommendation."
            action={<Link to="/recommend" className="btn-primary">Get Your First Recommendation</Link>}
          />
        )}
      </section>
    </PageLayout>
  );
};

export default DashboardPage;
