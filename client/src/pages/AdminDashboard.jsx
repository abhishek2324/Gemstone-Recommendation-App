import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recommendationAPI } from '../services/api';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { IoDiamond, IoSparkles, IoPeople, IoPieChart } from 'react-icons/io5';
import { formatDate } from '../utils/formatDate';
import { handleImageError } from '../utils/imageFallback';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await recommendationAPI.getStats();
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
        badge="Admin Panel"
        title="Admin Dashboard"
        subtitle="Global system statistics and resource management"
        actions={
          <>
            <Link to="/admin/gemstones" className="btn-primary !py-2.5 !px-5 text-sm">
              Manage Gemstones
            </Link>
            <Link to="/admin/users" className="btn-secondary !py-2.5 !px-5 text-sm">
              Manage Users
            </Link>
          </>
        }
      />

      <section className="page-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          <StatsCard icon={<IoPeople />} label="Total Users" value={stats?.totalUsers || 0} color="info" />
          <StatsCard icon={<IoDiamond />} label="Total Gemstones" value={stats?.totalGemstones || 0} color="gold" />
          <StatsCard icon={<IoPieChart />} label="Recommendations Generated" value={stats?.totalRecommendations || 0} color="gem" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className="card-glass-lg">
          <h3 className="font-outfit font-bold text-xl md:text-2xl text-text-primary mb-6 flex items-center gap-3">
            <IoDiamond className="text-gem-400 text-2xl" /> Popular Gemstones
          </h3>
          {stats?.topGemstones?.length > 0 ? (
            <div className="space-y-5">
              {stats.topGemstones.map((gem) => (
                <div key={gem.name} className="flex items-center gap-5 py-3 border-b border-border-subtle last:border-0">
                  <img
                    src={gem.image}
                    alt={gem.name}
                    loading="lazy"
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                    onError={(e) => handleImageError(e, gem.name, 56)}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-outfit font-semibold text-lg text-text-primary">{gem.name}</h4>
                    <p className="text-text-muted text-sm capitalize">{gem.color}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-outfit font-bold text-text-primary">{gem.count} recs</div>
                    <div className="text-sm text-text-muted">Avg: {gem.avgScore}%</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-center py-10">No recommendation data yet.</p>
          )}
        </div>

        <div className="card-glass-lg">
          <h3 className="font-outfit font-bold text-xl md:text-2xl text-text-primary mb-6 flex items-center gap-3">
            <IoSparkles className="text-gold-400 text-2xl" /> Recent Matches
          </h3>
          {stats?.recentRecommendations?.length > 0 ? (
            <div className="space-y-5">
              {stats.recentRecommendations.map((rec) => (
                <div key={rec._id} className="flex items-center justify-between gap-4 py-3 border-b border-border-subtle last:border-0">
                  <div className="min-w-0">
                    <h4 className="font-outfit font-semibold text-lg text-text-primary truncate">
                      {rec.gemstoneId?.name || 'Deleted Gemstone'}
                    </h4>
                    <p className="text-text-muted text-sm">User: {rec.userId?.name || 'Guest/Deleted'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-gem-400 font-outfit font-bold text-xl">{rec.matchScore}%</div>
                    <div className="text-text-muted text-xs">{formatDate(rec.recommendationDate)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-center py-10">No matches saved yet.</p>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default AdminDashboard;
