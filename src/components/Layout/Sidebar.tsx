import React, { useState, useEffect } from 'react';
import { Form } from '../../types';
import { apiService } from '../../services/api';
import { FileText, Search, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

interface SidebarProps {
  selectedFormId?: string;
  onSelectForm: (form: Form) => void;
  onEditForm: (form: Form) => void;
  onDeleteForm: (formId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedFormId,
  onSelectForm,
  onEditForm,
  onDeleteForm
}) => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const fetchedForms = await apiService.getForms();
      setForms(fetchedForms);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (e: React.MouseEvent, formId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await apiService.deleteForm(formId);
        setForms(forms.filter(f => f.id !== formId));
        onDeleteForm(formId);
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No forms found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                  selectedFormId === form.id
                    ? 'bg-blue-100 border-2 border-blue-300'
                    : 'bg-white hover:bg-gray-100 border border-gray-200'
                }`}
                onClick={() => onSelectForm(form)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {form.title}
                    </h3>
                    {form.subtitle && (
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {form.subtitle}
                      </p>
                    )}
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(form.updatedAt).toLocaleDateString()}
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                        form.status === 'published' ? 'bg-green-100 text-green-800' :
                        form.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {form.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectForm(form);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditForm(form);
                      }}
                      className="p-1 text-gray-400 hover:text-green-600 rounded"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, form.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;