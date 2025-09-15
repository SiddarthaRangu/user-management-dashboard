import React, { createContext, useContext, useState } from 'react';
import { X, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} />;
      case 'error': return <XCircle size={20} />;
      case 'warning': return <AlertCircle size={20} />;
      default: return <CheckCircle size={20} />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-emerald-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'warning': return 'bg-orange-500 text-white';
      default: return 'bg-emerald-500 text-white';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${getStyles(notification.type)}`}>
          <div className="flex items-center space-x-3">
            {getIcon(notification.type)}
            <span className="font-medium">{notification.message}</span>
            <button 
              onClick={hideNotification}
              className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors duration-200"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;