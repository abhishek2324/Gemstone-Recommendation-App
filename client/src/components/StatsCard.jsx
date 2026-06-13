import { memo } from 'react';
import { motion } from 'framer-motion';

const colorStyles = {
  gem: {
    card: 'from-gem-500/20 to-gem-900/10 border-gem-500/20',
    icon: 'text-gem-400 bg-gem-500/15',
  },
  gold: {
    card: 'from-gold-500/20 to-gold-900/10 border-gold-500/20',
    icon: 'text-gold-400 bg-gold-500/15',
  },
  success: {
    card: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/20',
    icon: 'text-emerald-400 bg-emerald-500/15',
  },
  info: {
    card: 'from-blue-500/20 to-blue-900/10 border-blue-500/20',
    icon: 'text-blue-400 bg-blue-500/15',
  },
  danger: {
    card: 'from-red-500/20 to-red-900/10 border-red-500/20',
    icon: 'text-red-400 bg-red-500/15',
  },
};

const StatsCard = ({ icon, label, value, color = 'gem', delay = 0 }) => {
  const styles = colorStyles[color] || colorStyles.gem;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`bg-gradient-to-br ${styles.card} border rounded-2xl p-6 md:p-8 min-h-[140px] flex flex-col justify-center hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex items-start gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${styles.icon}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-text-muted text-sm font-medium mb-1.5">{label}</p>
          <p className="font-outfit font-bold text-2xl md:text-3xl text-text-primary truncate" title={String(value)}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(StatsCard);
