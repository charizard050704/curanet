import { motion } from 'framer-motion';

/**
 * Loading spinner component
 * @param {Object} props
 * @param {boolean} props.fullScreen - Whether to display the loader full screen
 * @param {string} props.size - Size of the loader ('sm', 'md', 'lg')
 * @param {string} props.color - Color of the loader
 */
const Loader = ({ fullScreen = false, size = 'md', color = 'blue-500' }) => {
  // Determine size class
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }[size] || 'w-10 h-10';

  const spinner = (
    <motion.div
      className={`inline-block ${sizeClass} border-4 border-t-${color} border-r-${color}/30 border-b-${color}/10 border-l-${color}/70 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <div className="text-center">
          {spinner}
          <p className="mt-2 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <div className="flex justify-center py-4">{spinner}</div>;
};

export default Loader; 