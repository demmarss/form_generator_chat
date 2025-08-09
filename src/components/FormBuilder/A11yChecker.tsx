import React, { useState, useEffect } from 'react';
import { Form } from '../../types';
import { Shield, AlertTriangle, CheckCircle, Info, Eye, Keyboard, Users } from 'lucide-react';

interface A11yIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'keyboard' | 'screen-reader' | 'color-contrast' | 'structure' | 'labels';
  element: string;
  message: string;
  suggestion: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
}

interface A11yCheckerProps {
  form: Form;
}

const A11yChecker: React.FC<A11yCheckerProps> = ({ form }) => {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    analyzeAccessibility();
  }, [form]);

  const analyzeAccessibility = async () => {
    setLoading(true);
    
    // Simulate accessibility analysis
    const mockIssues: A11yIssue[] = [
      {
        id: '1',
        type: 'error',
        category: 'labels',
        element: 'Email field',
        message: 'Form field missing accessible label',
        suggestion: 'Add a proper label element or aria-label attribute',
        wcagLevel: 'A'
      },
      {
        id: '2',
        type: 'warning',
        category: 'color-contrast',
        element: 'Submit button',
        message: 'Color contrast ratio is below 4.5:1',
        suggestion: 'Increase contrast between text and background colors',
        wcagLevel: 'AA'
      },
      {
        id: '3',
        type: 'info',
        category: 'keyboard',
        element: 'Custom dropdown',
        message: 'Element may not be keyboard accessible',
        suggestion: 'Ensure all interactive elements can be reached via keyboard',
        wcagLevel: 'A'
      },
      {
        id: '4',
        type: 'warning',
        category: 'structure',
        element: 'Form sections',
        message: 'Missing heading hierarchy',
        suggestion: 'Use proper heading levels (h1, h2, h3) to structure content',
        wcagLevel: 'AA'
      }
    ];

    setIssues(mockIssues);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: 'All Issues', icon: Shield },
    { id: 'keyboard', name: 'Keyboard', icon: Keyboard },
    { id: 'screen-reader', name: 'Screen Reader', icon: Eye },
    { id: 'color-contrast', name: 'Color Contrast', icon: Eye },
    { id: 'structure', name: 'Structure', icon: Users },
    { id: 'labels', name: 'Labels', icon: Info }
  ];

  const filteredIssues = selectedCategory === 'all' 
    ? issues 
    : issues.filter(issue => issue.category === selectedCategory);

  const getIssueIcon = (type: A11yIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getWcagBadge = (level: A11yIssue['wcagLevel']) => {
    const colors = {
      'A': 'bg-green-100 text-green-800',
      'AA': 'bg-blue-100 text-blue-800',
      'AAA': 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
        WCAG {level}
      </span>
    );
  };

  const issueStats = {
    total: issues.length,
    errors: issues.filter(i => i.type === 'error').length,
    warnings: issues.filter(i => i.type === 'warning').length,
    info: issues.filter(i => i.type === 'info').length
  };

  const accessibilityScore = Math.max(0, 100 - (issueStats.errors * 20 + issueStats.warnings * 10 + issueStats.info * 5));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Shield className="h-6 w-6 mr-2" />
          Accessibility Checker
        </h2>
        <button
          onClick={analyzeAccessibility}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Re-analyze
        </button>
      </div>

      {/* Accessibility Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Accessibility Score</h3>
            <p className="text-sm text-gray-600">Based on WCAG 2.1 guidelines</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              accessibilityScore >= 90 ? 'text-green-600' :
              accessibilityScore >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {accessibilityScore}%
            </div>
            <div className="flex items-center mt-2">
              {accessibilityScore >= 90 ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-1" />
              )}
              <span className="text-sm text-gray-600">
                {accessibilityScore >= 90 ? 'Excellent' :
                 accessibilityScore >= 70 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Issue Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{issueStats.total}</p>
            </div>
            <Shield className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Errors</p>
              <p className="text-2xl font-bold text-red-600">{issueStats.errors}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">{issueStats.warnings}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Info</p>
              <p className="text-2xl font-bold text-blue-600">{issueStats.info}</p>
            </div>
            <Info className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-500">Your form meets accessibility standards for this category</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div key={issue.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{issue.element}</h4>
                      {getWcagBadge(issue.wcagLevel)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{issue.message}</p>
                    <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Suggestion:</strong> {issue.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default A11yChecker;