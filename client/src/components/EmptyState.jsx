const EmptyState = ({ icon, title, description, action }) => (
  <div className="card-glass-lg text-center py-16 md:py-20 px-8">
    {icon && <div className="mb-6 flex justify-center">{icon}</div>}
    <h3 className="font-outfit font-semibold text-xl md:text-2xl text-text-primary mb-3">
      {title}
    </h3>
    {description && (
      <p className="text-text-muted text-base max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>
    )}
    {action}
  </div>
);

export default EmptyState;
