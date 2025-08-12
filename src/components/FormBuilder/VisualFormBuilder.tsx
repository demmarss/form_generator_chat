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
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalData, setModalData] = useState<{
    template: ElementTemplate | null;
    targetRow: FormRow | null;
    targetSection: FormSection | null;
  }>({ template: null, targetRow: null, targetSection: null });
  const [showElementSelector, setShowElementSelector] = useState(false);
  const [selectedRowForAdd, setSelectedRowForAdd] = useState<FormRow | null>(null);

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
      // Show modal for adding element
      if (dropData?.type === 'row') {
        const targetRow = currentPage.sections
          .flatMap(s => s.rows)
          .find(r => r.id === dropData.rowId);
        const targetSection = currentPage.sections
          .find(s => s.rows.some(r => r.id === dropData.rowId));
        
        setModalData({
          template: draggedData.template,
          targetRow,
          targetSection
        });
        setShowAddModal(true);
      } else {
        // Direct add to section or canvas
        handleAddElement(draggedData.template, dropData, 'new');
      }
    } else if (draggedData?.element) {
      // Moving existing element
      handleMoveElement(draggedData, dropData);
    }
  };

  const handleAddElement = (template: ElementTemplate, dropTarget: any, action: 'existing' | 'new' = 'new') => {
    if (!form || !currentPage) return;

    const newElement: FormElement = {
      id: `element_${Date.now()}`,
      rowId: '',
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

    // Handle adding to existing row
    if (action === 'existing' && dropTarget?.type === 'row' && dropTarget?.rowId) {
      // Find the section and row
      const targetSection = currentPage.sections.find(s => 
        s.rows.some(r => r.id === dropTarget.rowId)
      );
      const targetRow = targetSection?.rows.find(r => r.id === dropTarget.rowId);
      
      if (targetRow) {
        // Add element to existing row
        newElement.rowId = targetRow.id;
        newElement.elementNumber = targetRow.elements.length + 1;
        targetRow.elements.push(newElement);
      }
    }
    // Handle creating new row in section
    else if (action === 'new' && dropTarget?.type === 'section' && dropTarget?.sectionId) {
      const targetSection = currentPage.sections.find(s => s.id === dropTarget.sectionId);
      
      if (targetSection) {
        // Create new row in section
        const newRow: FormRow = {
          id: `row_${Date.now()}`,
          sectionId: targetSection.id,
          rowNumber: targetSection.rows.length + 1,
          rowName: `${targetSection.title.toLowerCase().replace(/\s+/g, '_')}_row_${targetSection.rows.length + 1}`,
          elements: []
        };
        targetSection.rows.push(newRow);
        newElement.rowId = newRow.id;
        newRow.elements.push(newElement);
      }
    }
    // Handle creating new row (default behavior)
    else {
      let targetSection: FormSection;
      
      if (currentPage.sections.length === 0) {
        // Create first section
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

      // Create new row
      const newRow: FormRow = {
        id: `row_${Date.now()}`,
        sectionId: targetSection.id,
        rowNumber: targetSection.rows.length + 1,
        rowName: `${targetSection.title.toLowerCase().replace(/\s+/g, '_')}_row_${targetSection.rows.length + 1}`,
        elements: []
      };
      targetSection.rows.push(newRow);
      newElement.rowId = newRow.id;
      newRow.elements.push(newElement);
    }

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
              onRowAddElement={handleRowAddElement}
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

        {/* Add Element Modal */}
        {showAddModal && modalData.template && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add "{modalData.template.label}" Element
                </h3>
                <p className="text-gray-600 mb-6">
                  Where would you like to add this element?
                </p>
                <div className="space-y-3">
                  {modalData.targetRow && (
                    <button
                     onClick={() => {
                       handleAddElement(modalData.template!, { type: 'row', rowId: modalData.targetRow!.id }, 'existing');
                       setShowAddModal(false);
                     }}
                      className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">Add to existing row</div>
                      <div className="text-sm text-gray-500">
                        Add to Row {modalData.targetRow.rowNumber} ({modalData.targetRow.elements.length} existing elements)
                      </div>
                    </button>
                  )}
                  <button
                   onClick={() => {
                     handleAddElement(modalData.template!, { type: 'section', sectionId: modalData.targetSection!.id }, 'new');
                     setShowAddModal(false);
                   }}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Create new row</div>
                    <div className="text-sm text-gray-500">
                      Create a new row in {modalData.targetSection?.title}
                    </div>
                  </button>
                </div>
               <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowAddModal(false)}
                   className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Element Selector Modal */}
        {showElementSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Select Element to Add</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Choose an element to add to Row {selectedRowForAdd?.rowNumber}
                </p>
              </div>
              <div className="p-6 overflow-y-auto max-h-96">
                <ElementSelector onElementSelect={handleElementSelectorChoice} />
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setShowElementSelector(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndContext>
  );
};

export default VisualFormBuilder;