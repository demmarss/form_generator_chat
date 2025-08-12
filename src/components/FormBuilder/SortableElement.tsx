import React from 'react';
import { useSortable } from '@dnd-kit/core';
import { FormElement, SelectedElement } from '../../types';
import { 
  Type, Mail, Phone, MessageSquare, List, CheckSquare, 
  Circle, Upload, PenTool, Calendar, Hash, Info,
  GripVertical, Settings, Trash2, Eye
} from 'lucide-react';

interface SortableElementProps {
  element: FormElement;
  selectedElement: SelectedElement | null;
  onElementSelect: (element: SelectedElement) => void;
}

const SortableElement: React.FC<SortableElementProps> = ({
  element,
  selectedElement,
  onElementSelect
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: element.id,
    data: { type: 'element', element }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const isSelected = selectedElement?.type === 'element' && selectedElement.id === element.id;

  const handleElementClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementSelect({
      type: 'element',
      id: element.id,
      name: element.label,
      data: element
    });
  };

  const getElementIcon = (type: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      text: Type,
      email: Mail,
      tel: Phone,
      textarea: MessageSquare,
      select: List,
      checkbox: CheckSquare,
      radio: Circle,
      file: Upload,
      signature: PenTool,
      date: Calendar,
      number: Hash,
      info: Info
    };
    return icons[type] || Type;
  };

  const Icon = getElementIcon(element.type);

  const renderPreview = () => {
    switch (element.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <input
            type={element.type}
            placeholder={element.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            disabled
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={element.placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            disabled
          />
        );
      case 'select':
        return (
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" disabled>
            <option>Select an option</option>
            {element.options?.choices?.slice(0, 2).map((choice: any, index: number) => (
              <option key={index}>{choice.label}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {element.options?.choices?.slice(0, 2).map((choice: any, index: number) => (
              <div key={index} className="flex items-center">
                <input type="radio" className="mr-2" disabled />
                <span className="text-sm">{choice.label}</span>
              </div>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {element.options?.choices?.slice(0, 2).map((choice: any, index: number) => (
              <div key={index} className="flex items-center">
                <input type="checkbox" className="mr-2" disabled />
                <span className="text-sm">{choice.label}</span>
              </div>
            ))}
          </div>
        );
      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Upload file</span>
          </div>
        );
      case 'signature':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <PenTool className="h-6 w-6 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-500">Signature pad</span>
          </div>
        );
      case 'info':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
              <span className="text-sm text-blue-800">{element.placeholder || 'Information text'}</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-lg p-3 text-center">
            <span className="text-sm text-gray-500">Unknown element</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border-2 rounded-lg transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      } hover:border-gray-300 cursor-pointer`}
      onClick={handleElementClick}
    >
      {/* Element Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:text-blue-600"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <Icon className="h-4 w-4 text-gray-600" />
          <div>
            <span className="text-sm font-medium text-gray-900">{element.label}</span>
            {element.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleElementClick(e);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Element Settings"
          >
            <Settings className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete element
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete Element"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Element Preview */}
      <div className="p-3">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {element.label}
            {element.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default SortableElement;