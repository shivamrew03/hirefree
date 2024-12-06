import { useEffect } from 'react';

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

  if (!show) return null;

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className={`${styles[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center`}>
        <span className="mr-2">
          {type === 'success' && '✓'}
          {type === 'error' && '✕'}
          {type === 'warning' && '⚠'}
        </span>
        {message}
      </div>
    </div>
  );
};

export default Toast;
