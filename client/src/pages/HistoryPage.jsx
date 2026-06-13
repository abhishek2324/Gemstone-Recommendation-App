import { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../services/api';
import PageLayout from '../components/PageLayout';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { IoDiamond } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../utils/formatDate';
import { handleImageError } from '../utils/imageFallback';
import toast from 'react-hot-toast';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await userAPI.getHistory();
      setHistory(res.data.data || []);
    } catch {
      toast.error('Failed to load recommendation history');
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
    <PageLayout size="default">
      <PageHeader
        badge="Your History"
        title="Recommendation History"
        subtitle="All your saved gemstone recommendations in one place"
      />

      {history.length > 0 ? (
        <div className="space-y-5 md:space-y-6">
          {history.map((rec) => (
            <div
              key={rec._id}
              className="card-glass flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8"
            >
              <img
                src={rec.gemstoneId?.image}
                alt={rec.gemstoneId?.name}
                loading="lazy"
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover shrink-0 mx-auto sm:mx-0"
                onError={(e) => handleImageError(e, rec.gemstoneId?.name, 112)}
              />
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <h3 className="font-outfit font-bold text-xl md:text-2xl text-text-primary">
                    {rec.gemstoneId?.name || 'Unknown Gemstone'}
                  </h3>
                  {rec.gemstoneId?.category && (
                    <span className="inline-block px-3 py-1 rounded-full bg-gem-500/10 text-gem-300 text-xs font-semibold capitalize max-w-max mx-auto sm:mx-0">
                      {rec.gemstoneId.category}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                  {rec.matchReasons?.map((reason) => (
                    <span key={reason} className="text-xs text-text-secondary bg-white/5 px-3 py-1.5 rounded-full">
                      {reason}
                    </span>
                  ))}
                </div>

                <p className="text-text-muted text-sm">
                  Saved on {formatDateTime(rec.recommendationDate)}
                </p>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-4 shrink-0">
                <div className="text-center sm:text-right">
                  <div className="text-3xl md:text-4xl font-outfit font-extrabold text-gem-400">{rec.matchScore}%</div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mt-1">Match Score</p>
                </div>
                {rec.gemstoneId && (
                  <Link to={`/gemstone/${rec.gemstoneId._id}`} className="btn-primary !py-2.5 !px-5 text-sm">
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<IoDiamond className="text-6xl text-gem-700" />}
          title="No Saved Recommendations"
          description="Discover your perfect gemstones and bookmark them to save them here."
          action={<Link to="/recommend" className="btn-primary">Get Recommendation</Link>}
        />
      )}
    </PageLayout>
  );
};

export default HistoryPage;
