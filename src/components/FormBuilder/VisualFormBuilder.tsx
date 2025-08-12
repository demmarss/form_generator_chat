import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Form, FormPage, FormSection, FormRow, FormElement, ElementTemplate, SelectedElement } from '../../types';
import ElementSelector from './ElementSelector';
import FormCanvas from './FormCanvas';
import PropertyPanel from './PropertyPanel';
import FormToolbar from './FormToolbar';
import { Plus, Eye, Code } from 'lucide-react';

interface VisualFormBuilderProps {
  form: Form | null;
  onFormUpdate: (form: Form) => void;
  onPreview: () => void;
  onViewCode: () => void;
}

const VisualFormBuilder: React.FC<VisualFormBuilderProps> = ({
  form,
  onFormUpdate,
  onPreview,
  onViewCode
}) => {
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">No form selected</p>
          <p className="text-sm text-gray-400">
            Create a new form or select an existing one to start building
          </p>
        </div>
      </div>
    );
  }

  const currentPage = form.pages[activePageIndex];

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedItem(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedItem(null);

    if (!over) return;

    const draggedData = active.data.current;
    const dropData = over.data.current;

    if (draggedData?.template) {
      // Adding new element from selector
      handleAddElement(draggedData.template, dropData);
    } else if (draggedData?.element) {
      // Moving existing element
      handleMoveElement(draggedData, dropData);
    }
  };

  const handleAddElement = (template: ElementTemplate, dropTarget: any) => {
    if (!form || !currentPage) return;

    const newElement: FormElement = {
      id: `element_${Date.now()}`,
      rowId: dropTarget?.rowId || '',
      type: template.type,
      label: template.defaultProps.label || template.label,
      name: `${template.type}_${Date.now()}`,
      placeholder: template.defaultProps.placeholder,
      required: template.defaultProps.required || false,
      validation: template.defaultProps.validation,
      options: template.defaultProps.options,
      properties: template.defaultProps.properties,
      elementNumber: 1
    };

    // Find target row or create new one
    let targetRow: FormRow;
    let targetSection: FormSection;

    if (dropTarget?.rowId) {
      // Add to existing row
      targetSection = currentPage.sections.find(s => 
        s.rows.some(r => r.id === dropTarget.rowId)
      )!;
      targetRow = targetSection.rows.find(r => r.id === dropTarget.rowId)!;
      newElement.elementNumber = targetRow.elements.length + 1;
    } else {
      // Create new row in first section or create section
      if (currentPage.sections.length === 0) {
        targetSection = {
          id: `section_${Date.now()}`,
          pageId: currentPage.id,
          title: 'Section 1',
          sectionNumber: 1,
          rows: []
        };
        currentPage.sections.push(targetSection);
      } else {
        targetSection = currentPage.sections[0];
      }

      targetRow = {
        id: `row_${Date.now()}`,
        sectionId: targetSection.id,
        rowNumber: targetSection.rows.length + 1,
        rowName: `${targetSection.title.toLowerCase().replace(/\s+/g, '_')}_row_${targetSection.rows.length + 1}`,
        elements: []
      };
      targetSection.rows.push(targetRow);
      newElement.rowId = targetRow.id;
    }

    targetRow.elements.push(newElement);
    onFormUpdate({ ...form });
  };

  const handleMoveElement = (draggedData: any, dropData: any) => {
    // Implementation for moving elements between rows/sections
    console.log('Moving element:', draggedData, 'to:', dropData);
  };

  const handleElementSelect = (element: SelectedElement) => {
    setSelectedElement(element);
    setShowPropertyPanel(true);
  };

  const handlePropertyUpdate = (updates: any) => {
    if (!selectedElement || !form) return;

    const updatedForm = { ...form };
    
    // Update the selected element with new properties
    // This would involve traversing the form structure and updating the specific element
    
    onFormUpdate(updatedForm);
  };

  const handleAddPage = () => {
    if (!form) return;

    const newPage: FormPage = {
      id: `page_${Date.now()}`,
      formId: form.id,
      title: `Page ${form.pages.length + 1}`,
      pageNumber: form.pages.length + 1,
      sections: []
    };

    const updatedForm = {
      ...form,
      isMultiPage: true,
      pages: [...form.pages, newPage]
    };

    onFormUpdate(updatedForm);
    setActivePageIndex(form.pages.length);
  };

  const handleAddSection = () => {
    if (!form || !currentPage) return;

    const newSection: FormSection = {
      id: `section_${Date.now()}`,
      pageId: currentPage.id,
      title: `Section ${currentPage.sections.length + 1}`,
      sectionNumber: currentPage.sections.length + 1,
      rows: []
    };

    currentPage.sections.push(newSection);
    onFormUpdate({ ...form });
  };

  const handleAddRow = (sectionId: string) => {
    if (!form || !currentPage) return;

    const section = currentPage.sections.find(s => s.id === sectionId);
    if (!section) return;

    const newRow: FormRow = {
      id: `row_${Date.now()}`,
      sectionId: section.id,
      rowNumber: section.rows.length + 1,
      rowName: `${section.title.toLowerCase().replace(/\s+/g, '_')}_row_${section.rows.length + 1}`,
      elements: []
    };

    section.rows.push(newRow);
    onFormUpdate({ ...form });
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-full flex bg-gray-50">
        {/* Element Selector */}
        <ElementSelector onElementSelect={() => {}} />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <FormToolbar
            form={form}
            activePageIndex={activePageIndex}
            onPageChange={setActivePageIndex}
            onAddPage={handleAddPage}
            onAddSection={handleAddSection}
            onPreview={onPreview}
            onViewCode={onViewCode}
          />

          {/* Form Canvas */}
          <div className="flex-1 overflow-auto">
            <FormCanvas
              page={currentPage}
              selectedElement={selectedElement}
              onElementSelect={handleElementSelect}
              onAddRow={handleAddRow}
            />
          </div>
        </div>

        {/* Property Panel */}
        {showPropertyPanel && selectedElement && (
          <PropertyPanel
            selectedElement={selectedElement}
            onUpdate={handlePropertyUpdate}
            onClose={() => setShowPropertyPanel(false)}
          />
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {draggedItem?.template && (
            <div className="bg-white border border-blue-300 rounded-lg p-3 shadow-lg">
              <span className="text-sm font-medium">{draggedItem.template.label}</span>
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default VisualFormBuilder;