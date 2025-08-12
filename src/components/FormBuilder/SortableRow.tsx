import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { FormRow, SelectedElement } from '../../types';
import SortableElement from './SortableElement';
import { Plus, GripVertical, Settings, Trash2, Columns } from 'lucide-react';

interface SortableRowProps {
  row: FormRow;
  selectedElement: SelectedElement | null;
  onElementSelect: (element: SelectedElement) => void;
  onRowAddElement: (rowId: string) => void;
}

const SortableRow: React.FC<SortableRowProps> = ({
  row,
  selectedElement,
  onElementSelect,
  onRowAddElement
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: row.id,
    data: { type: 'row', row }
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `row-${row.id}`,
    data: { 
      type: 'row', 
      rowId: row.id, 
      acceptsElements: true,
      row: row
    }
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const isSelected = selectedElement?.type === 'row' && selectedElement.id === row.id;

  const handleRowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onElementSelect({
      type: 'row',
      id: row.id,
      name: row.rowName,
      data: row
    });
  };

  return (
    <div
      ref={(node) => {
        setSortableRef(node);
        setDroppableRef(node);
      }}
      style={style}
      className={`border rounded-lg transition-all ${
        isDragging ? 'opacity-50' : ''
      } ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
      } ${
        isOver ? 'border-blue-300 bg-blue-100' : ''
      }`}
    >
      {/* Row Header */}
      <div
        className="flex items-center justify-between p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
        onClick={handleRowClick}
      >
        <div className="flex items-center space-x-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:text-blue-600"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          <Columns className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Row {row.rowNumber} ({row.elements.length} element{row.elements.length !== 1 ? 's' : ''})
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(e);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
            title="Row Settings"
          >
            <Settings className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete row
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            title="Delete Row"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Row Content */}
      <div className="p-3">
        {row.elements.length === 0 ? (
          <div 
            className={`text-center py-8 border-2 border-dashed rounded-lg bg-white transition-colors cursor-pointer hover:bg-gray-50 ${
            isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
            onClick={() => onRowAddElement(row.id)}
          >
            <Plus className="h-6 w-6 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              Drop elements here or click the + button above to add elements
            </p>
          </div>
        ) : (
          <SortableContext
            items={row.elements.map(e => e.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className={`grid gap-4 transition-all ${
              row.elements.length === 1 ? 'grid-cols-1' :
              row.elements.length === 2 ? 'grid-cols-2' :
              row.elements.length === 3 ? 'grid-cols-3' :
              'grid-cols-4'
            } ${isOver ? 'bg-blue-50 p-2 rounded-lg border-2 border-dashed border-blue-300' : ''}`}>
              {row.elements.map((element) => (
                <SortableElement
                  key={element.id}
                  element={element}
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

export default SortableRow;