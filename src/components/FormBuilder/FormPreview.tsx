import React, { useState } from 'react';
import { Form, FormElement } from '../../types';
import { ArrowLeft, ArrowRight, Upload, PenTool, Info } from 'lucide-react';
import * as yup from 'yup';

interface FormPreviewProps {
  form: Form | null;
  onElementClick?: (element: FormElement) => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form, onElementClick }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No form selected</p>
          <p className="text-sm text-gray-400 mt-1">
            Use the chat interface to generate a form
          </p>
        </div>
      </div>
    );
  }

  const currentFormPage = form.pages[currentPage];
  const isLastPage = currentPage === form.pages.length - 1;
  const isFirstPage = currentPage === 0;

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCurrentPage = () => {
    const pageElements: FormElement[] = [];
    currentFormPage.sections.forEach(section => {
      section.rows.forEach(row => {
        row.elements.forEach(element => {
          pageElements.push(element);
        });
      });
    });

    const newErrors: Record<string, string> = {};
    
    pageElements.forEach(element => {
      if (element.required && !formData[element.name]) {
        newErrors[element.name] = `${element.label} is required`;
      }
      
      if (element.validation && formData[element.name]) {
        try {
          const schema = yup.string();
          if (element.type === 'email') {
            schema.email('Please enter a valid email address');
          }
          schema.validateSync(formData[element.name]);
        } catch (error: any) {
          newErrors[element.name] = error.message;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentPage()) {
      setCurrentPage(prev => Math.min(prev + 1, form.pages.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (validateCurrentPage()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully!');
    }
  };

  const renderElement = (element: FormElement) => {
    const hasError = errors[element.name];
    const inputClassName = `mt-1 block w-full rounded-lg border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

    const handleElementClick = () => {
      if (onElementClick) {
        onElementClick(element);
      }
    };

    switch (element.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <div key={element.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {element.label} {element.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={element.type}
              name={element.name}
              placeholder={element.placeholder}
              value={formData[element.name] || ''}
              onChange={(e) => handleInputChange(element.name, e.target.value)}
              onClick={handleElementClick}
              className={inputClassName}
            />
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={element.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {element.label} {element.required && <span className="text-red-500">*</span>}
            </label>
            <textarea
              name={element.name}
              placeholder={element.placeholder}
              value={formData[element.name] || ''}
              onChange={(e) => handleInputChange(element.name, e.target.value)}
              onClick={handleElementClick}
              rows={4}
              className={inputClassName}
            />
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={element.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {element.label} {element.required && <span className="text-red-500">*</span>}
            </label>
            <select
              name={element.name}
              value={formData[element.name] || ''}
              onChange={(e) => handleInputChange(element.name, e.target.value)}
              onClick={handleElementClick}
              className={inputClassName}
            >
              <option value="">Select an option</option>
              {element.options?.choices?.map((choice: any, index: number) => (
                <option key={index} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'radio':
        return (
          <div key={element.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {element.label} {element.required && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-2" onClick={handleElementClick}>
              {element.options?.choices?.map((choice: any, index: number) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`${element.name}_${index}`}
                    name={element.name}
                    value={choice.value}
                    checked={formData[element.name] === choice.value}
                    onChange={(e) => handleInputChange(element.name, e.target.value)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor={`${element.name}_${index}`} className="ml-3 block text-sm text-gray-900">
                    {choice.label}
                  </label>
                </div>
              ))}
            </div>
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={element.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {element.label} {element.required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex items-center" onClick={handleElementClick}>
              <input
                type="checkbox"
                name={element.name}
                checked={formData[element.name] || false}
                onChange={(e) => handleInputChange(element.name, e.target.checked)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-3 block text-sm text-gray-900">
                {element.placeholder || 'Check this box'}
              </label>
            </div>
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'file':
        return (
          <div key={element.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {element.label} {element.required && <span className="text-red-500">*</span>}
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
                hasError ? 'border-red-300' : 'border-gray-300'
              } hover:border-gray-400 cursor-pointer`}
              onClick={handleElementClick}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <span>Upload a file or drag and drop</span>
                </div>
              </div>
            </div>
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'signature':
        return (
          <div key={element.id} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {element.label} {element.required && <span className="text-red-500">*</span>}
            </label>
            <div
              className={`mt-1 border-2 border-dashed rounded-lg p-4 ${
                hasError ? 'border-red-300' : 'border-gray-300'
              } hover:border-gray-400 cursor-pointer`}
              onClick={handleElementClick}
            >
              <div className="flex items-center justify-center h-32 text-center">
                <div className="space-y-2">
                  <PenTool className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to add signature</p>
                </div>
              </div>
            </div>
            {hasError && <p className="text-sm text-red-600">{hasError}</p>}
          </div>
        );

      case 'info':
        return (
          <div key={element.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4" onClick={handleElementClick}>
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">{element.label}</h4>
                {element.placeholder && (
                  <p className="mt-1 text-sm text-blue-800">{element.placeholder}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div key={element.id} className="p-4 bg-gray-100 rounded-lg" onClick={handleElementClick}>
            <p className="text-sm text-gray-600">Unknown element type: {element.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-6">
        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {form.companyLogo && (
            <div className="text-center mb-4">
              <img src={form.companyLogo} alt="Company Logo" className="h-16 mx-auto" />
            </div>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
            {form.subtitle && (
              <p className="text-lg text-gray-600 mb-4">{form.subtitle}</p>
            )}
            {form.description && (
              <p className="text-gray-600 mb-4">{form.description}</p>
            )}
            {form.companyAddress && (
              <p className="text-sm text-gray-500">{form.companyAddress}</p>
            )}
          </div>
          
          {form.isMultiPage && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Page {currentPage + 1} of {form.pages.length}</span>
                <span>{currentFormPage.title}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentPage + 1) / form.pages.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {currentFormPage.sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-gray-600">{section.description}</p>
                )}
              </div>
              
              <div className="space-y-6">
                {section.rows.map((row) => (
                  <div key={row.id} className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                    {row.elements.map(renderElement)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {(form.isMultiPage || isLastPage) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {!isFirstPage && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center space-x-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </button>
                )}
              </div>
              
              <div>
                {!isLastPage ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPreview;