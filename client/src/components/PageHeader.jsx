import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, badge, actions, className = '' }) => (
  <motion.header
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`mb-10 md:mb-14 ${className}`}
  >
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3 max-w-3xl">
        {badge && (
          <span className="inline-flex items-center rounded-full border border-gem-500/25 bg-gem-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gem-300">
            {badge}
          </span>
        )}
        <h1 className="font-outfit font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  </motion.header>
);

export default PageHeader;
