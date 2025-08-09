import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import ChatInterface from './components/Chat/ChatInterface';
import FormPreview from './components/FormBuilder/FormPreview';
import CodeViewer from './components/FormBuilder/CodeViewer';
import { Form, SelectedElement } from './types';
import { MessageSquare, Eye, Code, Settings } from 'lucide-react';

function App() {
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'preview' | 'code'>('chat');
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleNewForm = () => {
    setSelectedForm(null);
    setGeneratedForm(null);
    setActiveTab('chat');
    setSelectedElements([]);
    setIsEditMode(false);
  };

  const handleSelectForm = (form: Form) => {
    setSelectedForm(form);
    setGeneratedForm(null);
    setActiveTab('preview');
    setSelectedElements([]);
    setIsEditMode(false);
  };

  const handleEditForm = (form: Form) => {
    setSelectedForm(form);
    setGeneratedForm(null);
    setActiveTab('preview');
    setSelectedElements([]);
    setIsEditMode(true);
  };

  const handleDeleteForm = (formId: string) => {
    if (selectedForm && selectedForm.id === formId) {
      setSelectedForm(null);
      setGeneratedForm(null);
      setActiveTab('chat');
    }
  };

  const handleFormGenerated = (formData: any) => {
    setGeneratedForm(formData);
    setActiveTab('preview');
  };

  const displayForm = generatedForm || selectedForm;

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <Header onNewForm={handleNewForm} />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedFormId={selectedForm?.id}
          onSelectForm={handleSelectForm}
          onEditForm={handleEditForm}
          onDeleteForm={handleDeleteForm}
        />
        
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat</span>
              </button>
              
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                disabled={!displayForm}
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'code'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                disabled={!displayForm}
              >
                <Code className="h-4 w-4" />
                <span>Code</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' && (
              <ChatInterface
                selectedElements={selectedElements}
                onFormGenerated={handleFormGenerated}
              />
            )}
            
            {activeTab === 'preview' && (
              <FormPreview
                form={displayForm}
                onElementClick={(element) => {
                  // Handle element selection for prompting
                  const selectedElement: SelectedElement = {
                    type: 'element',
                    id: element.id,
                    name: element.label,
                    data: element
                  };
                  setSelectedElements([selectedElement]);
                  setActiveTab('chat');
                }}
              />
            )}
            
            {activeTab === 'code' && (
              <CodeViewer form={displayForm} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;