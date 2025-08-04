'use client';

import { useState } from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen = true, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Navigation menu items with uniform blue icons
  const menuItems = [
    { 
      id: 'dashboard', 
      icon: 'fas fa-chart-line', 
      label: 'Dashboard',
      description: 'Climate overview & analytics'
    },
    { 
      id: 'map', 
      icon: 'fas fa-globe-africa', 
      label: 'Spatial Explorer',
      description: 'Satellite & environmental data'
    },
    { 
      id: 'ai', 
      icon: 'fas fa-brain', 
      label: 'AI Insights',
      description: 'Predictions & recommendations'
    },
    { 
      id: 'marketplace', 
      icon: 'fas fa-store', 
      label: 'Marketplace',
      description: 'Agricultural trading hub'
    },
    { 
      id: 'farmer', 
      icon: 'fas fa-tractor', 
      label: 'Farmer Portal',
      description: 'Community & resources'
    },
    { 
      id: 'carbon', 
      icon: 'fas fa-leaf', 
      label: 'Carbon Credits',
      description: 'Environmental impact tracking'
    },
    { 
      id: 'reports', 
      icon: 'fas fa-file-chart-line', 
      label: 'Reports',
      description: 'Data analysis & insights'
    },
    { 
      id: 'settings', 
      icon: 'fas fa-cog', 
      label: 'Settings',
      description: 'Platform configuration'
    }
  ];

  const handleItemClick = (itemId: string) => {
    onSectionChange(itemId);
    // Close mobile sidebar after selection
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        sidebar fixed top-0 left-0 h-full z-40 
        w-80
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        transition-all duration-300 ease-in-out
        flex flex-col
      `}>
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <i className="fas fa-globe-americas text-white text-lg"></i>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <i className="fas fa-leaf text-white text-xs"></i>
              </div>
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                PLANET PULSE
              </h2>
              <p className="text-xs text-blue-600 font-medium">
                AI Climate Platform
              </p>
            </div>
          </div>
          
          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus-ring"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={`fas ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-gray-500 dark:text-gray-400`}></i>
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`
                    w-full text-left group relative px-4 py-3 rounded-lg mx-2 transition-all duration-200 flex items-center space-x-3
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'
                    }
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <i className={`${item.icon} text-lg flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'
                  }`}></i>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {item.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      isActive 
                        ? 'text-blue-100' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-300'
                    }`}>
                      {item.description}
                    </p>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick actions section */}
          <div className="mt-8 px-4">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors group text-gray-700 dark:text-gray-300">
                  <i className="fas fa-plus text-green-500 group-hover:text-green-600"></i>
                  <span className="text-sm group-hover:text-green-600 dark:group-hover:text-green-400">
                    New Report
                  </span>
                </button>
                <button className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group text-gray-700 dark:text-gray-300">
                  <i className="fas fa-download text-blue-500 group-hover:text-blue-600"></i>
                  <span className="text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Export Data
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <i className="fas fa-globe text-white text-sm"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                UNEP Kenya
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Environmental Monitoring
              </p>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}