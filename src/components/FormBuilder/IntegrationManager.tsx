import React, { useState, useEffect } from 'react';
import { FormIntegration } from '../../types';
import { Webhook, Mail, Zap, MessageSquare, FileSpreadsheet, Users, Plus, Settings, Trash2 } from 'lucide-react';

interface IntegrationManagerProps {
  formId: string;
}

const IntegrationManager: React.FC<IntegrationManagerProps> = ({ formId }) => {
  const [integrations, setIntegrations] = useState<FormIntegration[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<FormIntegration['type']>('webhook');

  const integrationTypes = [
    { type: 'webhook' as const, name: 'Webhook', icon: Webhook, description: 'Send form data to any URL' },
    { type: 'email' as const, name: 'Email', icon: Mail, description: 'Send notifications via email' },
    { type: 'zapier' as const, name: 'Zapier', icon: Zap, description: 'Connect to 5000+ apps' },
    { type: 'slack' as const, name: 'Slack', icon: MessageSquare, description: 'Post to Slack channels' },
    { type: 'sheets' as const, name: 'Google Sheets', icon: FileSpreadsheet, description: 'Save to spreadsheet' },
    { type: 'crm' as const, name: 'CRM', icon: Users, description: 'Sync with your CRM' }
  ];

  useEffect(() => {
    loadIntegrations();
  }, [formId]);

  const loadIntegrations = async () => {
    // Mock data - replace with real API call
    const mockIntegrations: FormIntegration[] = [
      {
        id: '1',
        formId,
        type: 'webhook',
        config: { url: 'https://api.example.com/webhook', method: 'POST' },
        isActive: true
      },
      {
        id: '2',
        formId,
        type: 'email',
        config: { to: 'admin@example.com', subject: 'New Form Submission' },
        isActive: true
      }
    ];
    setIntegrations(mockIntegrations);
  };

  const handleAddIntegration = () => {
    const newIntegration: FormIntegration = {
      id: Date.now().toString(),
      formId,
      type: selectedType,
      config: getDefaultConfig(selectedType),
      isActive: true
    };
    setIntegrations([...integrations, newIntegration]);
    setShowAddModal(false);
  };

  const getDefaultConfig = (type: FormIntegration['type']) => {
    switch (type) {
      case 'webhook':
        return { url: '', method: 'POST', headers: {} };
      case 'email':
        return { to: '', subject: 'New Form Submission', template: 'default' };
      case 'zapier':
        return { webhookUrl: '' };
      case 'slack':
        return { webhookUrl: '', channel: '#general' };
      case 'sheets':
        return { spreadsheetId: '', sheetName: 'Form Responses' };
      case 'crm':
        return { apiKey: '', endpoint: '' };
      default:
        return {};
    }
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, isActive: !integration.isActive }
        : integration
    ));
  };

  const deleteIntegration = (id: string) => {
    setIntegrations(integrations.filter(integration => integration.id !== id));
  };

  const getIntegrationIcon = (type: FormIntegration['type']) => {
    const integration = integrationTypes.find(i => i.type === type);
    return integration ? integration.icon : Webhook;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Integration</span>
        </button>
      </div>

      {/* Active Integrations */}
      <div className="space-y-4">
        {integrations.map((integration) => {
          const Icon = getIntegrationIcon(integration.type);
          const integrationInfo = integrationTypes.find(i => i.type === integration.type);
          
          return (
            <div
              key={integration.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${integration.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Icon className={`h-6 w-6 ${integration.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{integrationInfo?.name}</h3>
                  <p className="text-sm text-gray-500">{integrationInfo?.description}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      integration.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {integration.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleIntegration(integration.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    integration.isActive
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {integration.isActive ? 'Disable' : 'Enable'}
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded">
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteIntegration(integration.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {integrations.length === 0 && (
        <div className="text-center py-12">
          <Webhook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations yet</h3>
          <p className="text-gray-500 mb-4">Connect your form to external services to automate workflows</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Integration
          </button>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Integration</h3>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {integrationTypes.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <button
                      key={integration.type}
                      onClick={() => setSelectedType(integration.type)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        selectedType === integration.type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-8 w-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{integration.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIntegration}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Integration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationManager;