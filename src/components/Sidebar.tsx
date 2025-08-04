'use client';

import { useState, useEffect } from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    if (newIsDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { id: 'map', icon: 'fas fa-globe-africa', label: 'GIS Map' },
    { id: 'ai', icon: 'fas fa-robot', label: 'AI Recommendations' },
    { id: 'marketplace', icon: 'fas fa-store', label: 'Marketplace' },
    { id: 'farmer', icon: 'fas fa-user-farmer', label: 'Farmer Portal' },
    { id: 'carbon', icon: 'fas fa-leaf', label: 'Carbon Credits' },
    { id: 'feedback', icon: 'fas fa-comment-dots', label: 'Feedback' },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="sidebar-toggle-btn flex lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <div className={`sidebar w-64 flex-shrink-0 flex flex-col ${isOpen ? 'open' : ''}`}>
        <div className="p-4 flex items-center">
          <i className="fas fa-seedling text-2xl mr-3"></i>
          <span className="sidebar-text text-xl font-bold">PLANET PULSE AI</span>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <nav className="mt-6 flex flex-col gap-2 px-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsOpen(false); // Close mobile sidebar on selection
                }}
                className={`flex items-center px-2 py-3 rounded-lg focus:outline-none transition ${
                  activeSection === item.id 
                    ? 'bg-blue-700' 
                    : 'hover:bg-blue-700 cursor-pointer'
                }`}
              >
                <i className={`${item.icon} mr-3`}></i>
                <span className="sidebar-text">{item.label}</span>
              </button>
            ))}
            
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="flex items-center px-2 py-3 rounded-lg hover:bg-blue-700 cursor-pointer focus:outline-none transition"
            >
              <i className="fas fa-adjust mr-3"></i>
              <span className="sidebar-text">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full mr-2 bg-blue-500 flex items-center justify-center">
              <i className="fas fa-leaf text-white text-sm"></i>
            </div>
            <div className="sidebar-text">
              <div className="text-sm font-medium">Climate AI</div>
              <div className="text-xs text-blue-200">KENYA</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}