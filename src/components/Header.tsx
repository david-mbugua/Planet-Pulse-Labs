'use client';

interface HeaderProps {
  onRefreshData: () => void;
}

export default function Header({ onRefreshData }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm header">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Climate-Smart Agriculture & Environment Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={onRefreshData}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    </header>
  );
}