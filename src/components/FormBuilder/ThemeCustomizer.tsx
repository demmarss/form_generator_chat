import React, { useState } from 'react';
import { FormTheme } from '../../types';
import { Palette, Type, Layout, Rounded } from 'lucide-react';

interface ThemeCustomizerProps {
  currentTheme: FormTheme;
  onThemeChange: (theme: FormTheme) => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentTheme,
  onThemeChange
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout'>('colors');

  const presetThemes: FormTheme[] = [
    {
      id: 'modern',
      name: 'Modern Blue',
      colors: {
        primary: '#3B82F6',
        secondary: '#64748B',
        accent: '#10B981',
        background: '#FFFFFF',
        text: '#1F2937',
        border: '#E5E7EB'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter'
      },
      spacing: 'normal',
      borderRadius: 'medium'
    },
    {
      id: 'elegant',
      name: 'Elegant Purple',
      colors: {
        primary: '#8B5CF6',
        secondary: '#6B7280',
        accent: '#F59E0B',
        background: '#FEFEFE',
        text: '#111827',
        border: '#D1D5DB'
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Source Sans Pro'
      },
      spacing: 'spacious',
      borderRadius: 'large'
    },
    {
      id: 'minimal',
      name: 'Minimal Gray',
      colors: {
        primary: '#374151',
        secondary: '#9CA3AF',
        accent: '#EF4444',
        background: '#F9FAFB',
        text: '#1F2937',
        border: '#E5E7EB'
      },
      fonts: {
        heading: 'Roboto',
        body: 'Roboto'
      },
      spacing: 'compact',
      borderRadius: 'small'
    }
  ];

  const handleColorChange = (colorKey: keyof FormTheme['colors'], value: string) => {
    const updatedTheme = {
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [colorKey]: value
      }
    };
    onThemeChange(updatedTheme);
  };

  const handleFontChange = (fontKey: keyof FormTheme['fonts'], value: string) => {
    const updatedTheme = {
      ...currentTheme,
      fonts: {
        ...currentTheme.fonts,
        [fontKey]: value
      }
    };
    onThemeChange(updatedTheme);
  };

  const handleLayoutChange = (key: 'spacing' | 'borderRadius', value: any) => {
    const updatedTheme = {
      ...currentTheme,
      [key]: value
    };
    onThemeChange(updatedTheme);
  };

  return (
    <div className="bg-white border-l border-gray-200 w-80 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Theme Customizer
        </h3>
      </div>

      {/* Preset Themes */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Preset Themes</h4>
        <div className="grid grid-cols-1 gap-2">
          {presetThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                currentTheme.id === theme.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{theme.name}</span>
                <div className="flex space-x-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.colors.accent }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {(['colors', 'typography', 'layout'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium capitalize ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'colors' && <Palette className="h-4 w-4 mr-1" />}
            {tab === 'typography' && <Type className="h-4 w-4 mr-1" />}
            {tab === 'layout' && <Layout className="h-4 w-4 mr-1" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'colors' && (
          <div className="space-y-4">
            {Object.entries(currentTheme.colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key} Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof FormTheme['colors'], e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof FormTheme['colors'], e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heading Font
              </label>
              <select
                value={currentTheme.fonts.heading}
                onChange={(e) => handleFontChange('heading', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Source Sans Pro">Source Sans Pro</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Font
              </label>
              <select
                value={currentTheme.fonts.body}
                onChange={(e) => handleFontChange('body', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Source Sans Pro">Source Sans Pro</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spacing
              </label>
              <div className="space-y-2">
                {(['compact', 'normal', 'spacious'] as const).map((spacing) => (
                  <label key={spacing} className="flex items-center">
                    <input
                      type="radio"
                      name="spacing"
                      value={spacing}
                      checked={currentTheme.spacing === spacing}
                      onChange={(e) => handleLayoutChange('spacing', e.target.value)}
                      className="mr-3"
                    />
                    <span className="capitalize">{spacing}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Radius
              </label>
              <div className="space-y-2">
                {(['none', 'small', 'medium', 'large'] as const).map((radius) => (
                  <label key={radius} className="flex items-center">
                    <input
                      type="radio"
                      name="borderRadius"
                      value={radius}
                      checked={currentTheme.borderRadius === radius}
                      onChange={(e) => handleLayoutChange('borderRadius', e.target.value)}
                      className="mr-3"
                    />
                    <span className="capitalize">{radius}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeCustomizer;