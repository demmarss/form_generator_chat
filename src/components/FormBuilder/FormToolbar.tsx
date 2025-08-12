import React from 'react';
import { Form } from '../../types';
import { Plus, Eye, Code, Save, Settings, Layers, RowsIcon as Rows } from 'lucide-react';

interface FormToolbarProps {
  form: Form;
  activePageIndex: number;
  onPageChange: (index: number) => void;
  onAddPage: () => void;
  onAddSection: () => void;
  onPreview: () => void;
  onViewCode: () => void;
}

const FormToolbar: React.FC<FormToolbarProps> = ({
  form,
  activePageIndex,
  onPageChange,
  onAddPage,
  onAddSection,
  onPreview,
  onViewCode
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Form Info */}
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{form.title}</h2>
            <p className="text-sm text-gray-500">
              {form.pages.length} page{form.pages.length !== 1 ? 's' : ''} • 
              {form.pages.reduce((total, page) => total + page.sections.length, 0)} section{form.pages.reduce((total, page) => total + page.sections.length, 0) !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Center - Page Navigation */}
        {form.pages.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Pages:</span>
            {form.pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => onPageChange(index)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  activePageIndex === index
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onAddSection}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Layers className="h-4 w-4" />
            <span>Add Section</span>
          </button>
          
          <button
            onClick={onAddPage}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Page</span>
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          <button
            onClick={onPreview}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>

          <button
            onClick={onViewCode}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <Code className="h-4 w-4" />
            <span>Code</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormToolbar;