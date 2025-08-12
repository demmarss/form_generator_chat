import React, { useState, useEffect } from 'react';
import { SelectedElement } from '../../types';
import { X, Settings, Type, Eye, Code, Zap } from 'lucide-react';

interface PropertyPanelProps {
  selectedElement: SelectedElement;
  onUpdate: (updates: any) => void;
  onClose: () => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedElement,
  onUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'validation' | 'styling' | 'logic'>('general');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    setFormData(selectedElement.data);
  }, [selectedElement]);

  const handleInputChange = (field: string, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const renderGeneralTab = () => {
    if (selectedElement.type === 'element') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Label
            </label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={(e) => handleInputChange('label', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Field Name
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Placeholder
            </label>
            <input
              type="text"
              value={formData.placeholder || ''}
              onChange={(e) => handleInputChange('placeholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={formData.required || false}
              onChange={(e) => handleInputChange('required', e.target.checked)}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="required" className="text-sm font-medium text-gray-700">
              Required field
            </label>
          </div>

          {(formData.type === 'select' || formData.type === 'radio' || formData.type === 'checkbox') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {formData.options?.choices?.map((choice: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={choice.label}
                      onChange={(e) => {
                        const newChoices = [...formData.options.choices];
                        newChoices[index] = { ...choice, label: e.target.value };
                        handleInputChange('options', { ...formData.options, choices: newChoices });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Option label"
                    />
                    <input
                      type="text"
                      value={choice.value}
                      onChange={(e) => {
                        const newChoices = [...formData.options.choices];
                        newChoices[index] = { ...choice, value: e.target.value };
                        handleInputChange('options', { ...formData.options, choices: newChoices });
                      }}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Value"
                    />
                    <button
                      onClick={() => {
                        const newChoices = formData.options.choices.filter((_: any, i: number) => i !== index);
                        handleInputChange('options', { ...formData.options, choices: newChoices });
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newChoices = [
                      ...(formData.options?.choices || []),
                      { label: `Option ${(formData.options?.choices?.length || 0) + 1}`, value: `option${(formData.options?.choices?.length || 0) + 1}` }
                    ];
                    handleInputChange('options', { ...formData.options, choices: newChoices });
                  }}
                  className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400"
                >
                  Add Option
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (selectedElement.type === 'section') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );
    }

    return <div>General settings for {selectedElement.type}</div>;
  };

  const renderValidationTab = () => {
    if (selectedElement.type !== 'element') {
      return <div className="text-gray-500">Validation settings are only available for form elements.</div>;
    }

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Length
          </label>
          <input
            type="number"
            value={formData.validation?.min || ''}
            onChange={(e) => handleInputChange('validation', { 
              ...formData.validation, 
              min: parseInt(e.target.value) || 0 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Length
          </label>
          <input
            type="number"
            value={formData.validation?.max || ''}
            onChange={(e) => handleInputChange('validation', { 
              ...formData.validation, 
              max: parseInt(e.target.value) || 255 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {formData.type === 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern (Regex)
            </label>
            <input
              type="text"
              value={formData.validation?.matches || ''}
              onChange={(e) => handleInputChange('validation', { 
                ...formData.validation, 
                matches: e.target.value 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., ^[A-Za-z]+$"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Error Message
          </label>
          <input
            type="text"
            value={formData.validation?.message || ''}
            onChange={(e) => handleInputChange('validation', { 
              ...formData.validation, 
              message: e.target.value 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Custom validation error message"
          />
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'validation', name: 'Validation', icon: Zap },
    { id: 'styling', name: 'Styling', icon: Eye },
    { id: 'logic', name: 'Logic', icon: Code }
  ];

  return (
    <div className="bg-white border-l border-gray-200 w-80 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedElement.name}
        </h3>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 rounded"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Element Type Badge */}
      <div className="p-4 border-b border-gray-200">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Type className="h-4 w-4 mr-1" />
          {selectedElement.type}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-3 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4 mx-auto mb-1" />
              <div>{tab.name}</div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'validation' && renderValidationTab()}
        {activeTab === 'styling' && (
          <div className="text-gray-500">Styling options coming soon...</div>
        )}
        {activeTab === 'logic' && (
          <div className="text-gray-500">Conditional logic options coming soon...</div>
        )}
      </div>
    </div>
  );
};

export default PropertyPanel;