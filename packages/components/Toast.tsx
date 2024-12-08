import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  show: boolean;
  onClose: () => void;
}

const Toast = ({ message, type, show, onClose }: ToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const styles = {
    success: 'bg-white border-2 border-emerald-500 text-emerald-700',
    error: 'bg-white border-2 border-red-500 text-red-700',
    warning: 'bg-white border-2 border-yellow-500 text-yellow-700'
  };

  const iconColors = {
    success: 'bg-emerald-100 text-emerald-600',
    error: 'bg-red-100 text-red-600',
    warning: 'bg-yellow-100 text-yellow-600'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠'
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`${styles[type]} px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[320px]`}>
            <div className={`${iconColors[type]} rounded-full w-8 h-8 flex items-center justify-center`}>
              <span className="text-lg">{icons[type]}</span>
            </div>
            <p className="font-medium flex-1">{message}</p>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
