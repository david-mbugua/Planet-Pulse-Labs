'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  onRefreshData: () => void;
  onToggleSidebar?: () => void;
}

export default function Header({ onRefreshData, onToggleSidebar }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    
    setIsDarkMode(isDark);
    
    // Apply dark mode class to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const notifications = [
    { id: 1, type: 'alert', message: 'High deforestation alert in Kisumu region', time: '2 min ago', unread: true },
    { id: 2, type: 'info', message: 'Monthly climate report is ready', time: '1 hour ago', unread: true },
    { id: 3, type: 'success', message: 'Carbon credit calculation completed', time: '3 hours ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="navbar sticky top-0 z-40 h-16 flex items-center justify-between px-6 py-3">
      {/* Left side - Logo and mobile sidebar toggle */}
      <div className="flex items-center space-x-4">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring"
          aria-label="Toggle sidebar"
        >
          <i className="fas fa-bars text-lg text-gray-700 dark:text-gray-300"></i>
        </button>

        {/* Logo and title */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <i className="fas fa-globe-americas text-2xl text-blue-600"></i>
            <i className="fas fa-leaf text-sm text-green-500 absolute -top-1 -right-1"></i>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-gradient-unep">
              PLANET PULSE AI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              Climate Intelligence Platform
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Actions and user menu */}
      <div className="flex items-center space-x-3">
        {/* Refresh button */}
        <button
          onClick={onRefreshData}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring"
          title="Refresh data"
        >
          <i className="fas fa-sync-alt text-gray-600 dark:text-gray-400"></i>
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <i className={`fas ${isDarkMode ? 'fa-sun text-yellow-500' : 'fa-moon text-blue-600'}`}></i>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring relative"
            title="Notifications"
          >
            <i className="fas fa-bell text-gray-600 dark:text-gray-400"></i>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Notifications
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <i className={`fas ${
                          notification.type === 'alert' ? 'fa-exclamation-triangle text-red-500' :
                          notification.type === 'success' ? 'fa-check-circle text-green-500' :
                          'fa-info-circle text-blue-500'
                        } mt-1`}></i>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Climate Analyst
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                UNEP Kenya
              </p>
            </div>
            <i className="fas fa-chevron-down text-xs text-gray-500 dark:text-gray-400"></i>
          </button>

          {/* User dropdown menu */}
          {showUserDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowUserDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Climate Analyst
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    analyst@unep.org
                  </p>
                </div>
                <div className="py-2">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <i className="fas fa-user-circle mr-3 w-4 text-blue-600"></i>
                    My Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <i className="fas fa-cog mr-3 w-4 text-blue-600"></i>
                    Settings
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <i className="fas fa-question-circle mr-3 w-4 text-blue-600"></i>
                    Help & Support
                  </a>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt mr-3 w-4"></i>
                    Sign Out
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}