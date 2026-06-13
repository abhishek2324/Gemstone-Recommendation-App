import { IoDiamond } from 'react-icons/io5';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-gem-800 border-t-gem-400 animate-spin" />
        <IoDiamond className="absolute inset-0 m-auto text-gem-400 animate-pulse text-sm" />
      </div>
      {text && <p className="text-text-muted text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
