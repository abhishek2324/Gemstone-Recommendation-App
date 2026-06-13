import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import { IoDiamond } from 'react-icons/io5';
import { handleImageError } from '../utils/imageFallback';

const colorGradients = {
  Red: 'from-red-500/20 to-red-900/10',
  Blue: 'from-blue-500/20 to-blue-900/10',
  Green: 'from-emerald-500/20 to-emerald-900/10',
  Yellow: 'from-yellow-500/20 to-yellow-900/10',
  Purple: 'from-purple-500/20 to-purple-900/10',
  White: 'from-slate-300/20 to-slate-600/10',
  Pink: 'from-pink-500/20 to-pink-900/10',
  Orange: 'from-orange-500/20 to-orange-900/10',
  Black: 'from-gray-500/20 to-gray-900/10',
  Brown: 'from-amber-700/20 to-amber-900/10',
};

const colorDots = {
  Red: 'bg-red-500',
  Blue: 'bg-blue-500',
  Green: 'bg-emerald-500',
  Yellow: 'bg-yellow-500',
  Purple: 'bg-purple-500',
  White: 'bg-slate-300',
  Pink: 'bg-pink-500',
  Orange: 'bg-orange-500',
  Black: 'bg-gray-700',
  Brown: 'bg-amber-700',
};

const GemstoneCard = ({ gemstone, index = 0 }) => {
  const gradient = colorGradients[gemstone.color] || colorGradients.Purple;
  const dot = colorDots[gemstone.color] || 'bg-gem-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        to={`/gemstone/${gemstone._id}`}
        className={`flex flex-col h-full group rounded-2xl overflow-hidden bg-gradient-to-br ${gradient} border border-border-subtle hover:border-gem-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gem-500/10`}
      >
        <div className="relative h-52 sm:h-56 overflow-hidden shrink-0">
          <img
            src={gemstone.image}
            alt={gemstone.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => handleImageError(e, gemstone.name, 400)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass text-xs font-medium text-gem-300 capitalize">
            {gemstone.category}
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-gold-400">
            <FaStar size={13} />
            <span className="text-sm font-semibold">{gemstone.rating}</span>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h3 className="font-outfit font-semibold text-lg md:text-xl text-text-primary group-hover:text-gem-400 transition-colors line-clamp-1">
              {gemstone.name}
            </h3>
            <div className={`w-3.5 h-3.5 rounded-full ${dot} ring-2 ring-white/10 shrink-0`} />
          </div>

          <p className="text-text-muted text-sm line-clamp-2 mb-5 leading-relaxed flex-1">
            {gemstone.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-border-subtle/50 mt-auto">
            <span className="text-gold-400 font-outfit font-semibold text-sm md:text-base">
              ₹{gemstone.priceRange?.min?.toLocaleString()} - ₹{gemstone.priceRange?.max?.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5">
              <IoDiamond className="text-gem-500 text-xs" />
              <span className="text-text-muted text-xs">{gemstone.purposes?.length || 0} purposes</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default memo(GemstoneCard);
