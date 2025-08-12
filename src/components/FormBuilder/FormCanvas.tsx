import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormPage, FormSection, FormRow, FormElement, SelectedElement } from '../../types';
import SortableSection from './SortableSection';
import SortableRow from './SortableRow';
import SortableElement from './SortableElement';
import { Plus, Layout } from 'lucide-react';

interface FormCanvasProps {
  page: FormPage;
  selectedElement: SelectedElement | null;
  onElementSelect: (element: SelectedElement) => void;
  onAddRow: (sectionId: string) => void;
  onRowAddElement: (rowId: string) => void;
}

const FormCanvas: React.FC<FormCanvasProps> = ({
  page,
  selectedElement,
  onElementSelect,
  onAddRow,
  onRowAddElement
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
    data: { type: 'canvas', pageId: page.id }
  });

  if (!page.sections.length) {
    return (
      <div
        ref={setNodeRef}
        className={`h-full flex items-center justify-center ${
          isOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
        }`}
      >
        <div className="text-center">
          <Layout className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Canvas</h3>
          <p className="text-gray-500 mb-4">
            Drag elements from the sidebar to start building your form
          </p>
          <div className="text-sm text-gray-400">
            Or click "Add Section" in the toolbar to create a section first
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`p-6 min-h-full ${
        isOver ? 'bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{page.title}</h1>
            {page.description && (
              <p className="text-gray-600">{page.description}</p>
            )}
          </div>
        </div>

        {/* Sections */}
        <SortableContext
          items={page.sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {page.sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              selectedElement={selectedElement}
              onElementSelect={onElementSelect}
              onAddRow={onAddRow}
              onRowAddElement={onRowAddElement}
              onRowAddElement={onRowAddElement}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default FormCanvas;