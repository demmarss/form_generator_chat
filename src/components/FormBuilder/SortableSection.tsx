import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FormSection, SelectedElement } from '../../types';
import SortableRow from './SortableRow';
import { Plus, GripVertical, Settings, Trash2 } from 'lucide-react';

interface SortableSectionProps {
  section: FormSection;
  selectedElement: SelectedElement | null;
  onElementSelect: (element: SelectedElement) => void;
  onAddRow: (sectionId: string) => void;
}

const SortableSection: React.FC<SortableSectionProps> = ({
  section,
  selectedElement,
  onElementSelect,
  onAddRow
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: section.id,
    data: { type: 'section', section }
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `section-${section.id}`,
    data: { 
      type: 'section', 
      sectionId: section.id, 
      acceptsElements: true,
      section: section
    }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const isSelected = selectedElement?.type === 'section' && selectedElement.id === section.id;

  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementSelect({
      type: 'section',
      id: section.id,
      name: section.title,
      data: section
    });
  };

  return (
    <div
      ref={(node) => {
        setSortableRef(node);
        setDroppableRef(node);
      }}
      style={style}
      className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      } ${
        isOver ? 'border-blue-300 bg-blue-50' : ''
      }`}
    >
      {/* Section Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={handleSectionClick}
      >
        <div className="flex items-center space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:text-blue-600"
          >
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            {section.description && (
              <p className="text-sm text-gray-500">{section.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddRow(section.id);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Add Row"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSectionClick(e);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Section Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete section
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete Section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Section Content */}
      <div className="p-4">
        {section.rows.length === 0 ? (
          <div className={`text-center py-8 border-2 border-dashed rounded-lg transition-colors ${
            isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}>
            <Plus className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              Drop elements here or click "Add Row" to add form fields
            </p>
          </div>
        ) : (
          <SortableContext
            items={section.rows.map(r => r.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={`space-y-4 ${isOver ? 'bg-blue-50 p-4 rounded-lg border-2 border-dashed border-blue-300' : ''}`}>
              {section.rows.map((row) => (
                <SortableRow
                  key={row.id}
                  row={row}
                  selectedElement={selectedElement}
                  onElementSelect={onElementSelect}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};

export default SortableSection;