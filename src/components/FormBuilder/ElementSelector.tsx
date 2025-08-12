import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ElementTemplate } from '../../types';
import { 
  Type, Mail, Phone, MessageSquare, List, CheckSquare, 
  Circle, Upload, PenTool, Calendar, Hash, Info, 
  ToggleLeft, Star, MapPin, CreditCard, User
} from 'lucide-react';

interface ElementSelectorProps {
  onElementSelect: (template: ElementTemplate) => void;
}

const ElementSelector: React.FC<ElementSelectorProps> = ({ onElementSelect }) => {
  const elementTemplates: ElementTemplate[] = [
    // Basic Elements
    {
      id: 'text',
      type: 'text',
      label: 'Text Input',
      icon: 'Type',
      category: 'basic',
      defaultProps: {
        type: 'text',
        label: 'Text Field',
        name: 'textField',
        placeholder: 'Enter text...',
        required: false,
        validation: { min: 0, max: 255 }
      }
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      icon: 'Mail',
      category: 'basic',
      defaultProps: {
        type: 'email',
        label: 'Email Address',
        name: 'email',
        placeholder: 'your.email@example.com',
        required: true,
        validation: { email: true }
      }
    },
    {
      id: 'phone',
      type: 'tel',
      label: 'Phone',
      icon: 'Phone',
      category: 'basic',
      defaultProps: {
        type: 'tel',
        label: 'Phone Number',
        name: 'phone',
        placeholder: '(555) 123-4567',
        required: false,
        validation: { matches: /^\+?[\d\s\-\(\)]+$/ }
      }
    },
    {
      id: 'textarea',
      type: 'textarea',
      label: 'Textarea',
      icon: 'MessageSquare',
      category: 'basic',
      defaultProps: {
        type: 'textarea',
        label: 'Message',
        name: 'message',
        placeholder: 'Enter your message...',
        required: false,
        properties: { rows: 4 },
        validation: { min: 0, max: 1000 }
      }
    },
    {
      id: 'select',
      type: 'select',
      label: 'Dropdown',
      icon: 'List',
      category: 'basic',
      defaultProps: {
        type: 'select',
        label: 'Select Option',
        name: 'selectField',
        required: false,
        options: {
          choices: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' }
          ]
        }
      }
    },
    {
      id: 'checkbox',
      type: 'checkbox',
      label: 'Checkbox',
      icon: 'CheckSquare',
      category: 'basic',
      defaultProps: {
        type: 'checkbox',
        label: 'Checkbox Options',
        name: 'checkboxField',
        required: false,
        options: {
          choices: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' }
          ]
        }
      }
    },
    {
      id: 'radio',
      type: 'radio',
      label: 'Radio Buttons',
      icon: 'Circle',
      category: 'basic',
      defaultProps: {
        type: 'radio',
        label: 'Choose One',
        name: 'radioField',
        required: false,
        options: {
          choices: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' }
          ]
        }
      }
    },
    // Advanced Elements
    {
      id: 'file',
      type: 'file',
      label: 'File Upload',
      icon: 'Upload',
      category: 'advanced',
      defaultProps: {
        type: 'file',
        label: 'Upload File',
        name: 'fileUpload',
        required: false,
        properties: {
          accept: '.pdf,.doc,.docx,.jpg,.png',
          maxSize: '5MB',
          multiple: false
        }
      }
    },
    {
      id: 'signature',
      type: 'signature',
      label: 'Signature',
      icon: 'PenTool',
      category: 'advanced',
      defaultProps: {
        type: 'signature',
        label: 'Digital Signature',
        name: 'signature',
        required: false,
        properties: {
          width: 400,
          height: 200
        }
      }
    },
    {
      id: 'date',
      type: 'date',
      label: 'Date Picker',
      icon: 'Calendar',
      category: 'advanced',
      defaultProps: {
        type: 'date',
        label: 'Select Date',
        name: 'dateField',
        required: false,
        validation: { min: new Date().toISOString().split('T')[0] }
      }
    },
    {
      id: 'number',
      type: 'number',
      label: 'Number',
      icon: 'Hash',
      category: 'advanced',
      defaultProps: {
        type: 'number',
        label: 'Number Field',
        name: 'numberField',
        placeholder: '0',
        required: false,
        validation: { min: 0, max: 999999 }
      }
    },
    // Layout Elements
    {
      id: 'info',
      type: 'info',
      label: 'Info Text',
      icon: 'Info',
      category: 'layout',
      defaultProps: {
        type: 'info',
        label: 'Information',
        name: 'infoField',
        placeholder: 'This is an informational message for users.',
        required: false
      }
    }
  ];

  const categories = [
    { id: 'basic', name: 'Basic Elements', color: 'blue' },
    { id: 'advanced', name: 'Advanced Elements', color: 'purple' },
    { id: 'layout', name: 'Layout Elements', color: 'green' }
  ];

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Type, Mail, Phone, MessageSquare, List, CheckSquare, 
      Circle, Upload, PenTool, Calendar, Hash, Info
    };
    return icons[iconName] || Type;
  };

  return (
    <div className="bg-white border-r border-gray-200 w-64 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Form Elements</h3>
        <p className="text-sm text-gray-500 mt-1">Drag elements to add them to your form</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              {category.name}
            </h4>
            <div className="space-y-2">
              {elementTemplates
                .filter(template => template.category === category.id)
                .map((template) => (
                  <DraggableElement
                    key={template.id}
                    template={template}
                    onSelect={onElementSelect}
                    getIcon={getIcon}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface DraggableElementProps {
  template: ElementTemplate;
  onSelect: (template: ElementTemplate) => void;
  getIcon: (iconName: string) => React.ComponentType<any>;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ template, onSelect, getIcon }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: template.id,
    data: { template }
  });

  const Icon = getIcon(template.icon);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-grab hover:border-blue-300 hover:bg-blue-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={() => onSelect(template)}
    >
      <Icon className="h-5 w-5 text-gray-600" />
      <span className="text-sm font-medium text-gray-900">{template.label}</span>
    </div>
  );
};

export default ElementSelector;