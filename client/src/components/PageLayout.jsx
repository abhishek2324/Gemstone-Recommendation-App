const PageLayout = ({ children, size = 'default', className = '' }) => {
  const maxWidth = {
    narrow: 'max-w-3xl',
    default: 'max-w-5xl',
    wide: 'max-w-6xl',
    full: 'max-w-7xl',
  };

  return (
    <div className={`min-h-screen bg-gradient-mesh pt-28 md:pt-32 pb-16 md:pb-20 ${className}`}>
      <div className={`${maxWidth[size]} mx-auto px-5 sm:px-8 lg:px-10`}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
