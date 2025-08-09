import React from 'react';
import { FileText, Plus } from 'lucide-react';

interface HeaderProps {
  onNewForm: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewForm }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Form Creator</h1>
            <p className="text-sm text-gray-500">AI-Powered Form Builder</p>
          </div>
        </div>
        <button
          onClick={onNewForm}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Form</span>
        </button>
      </div>
    </header>
  );
};

export default Header;