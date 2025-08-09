import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

interface MCPFormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  structure: any;
  validationRules: any;
  bestPractices: string[];
}

interface MCPValidationSuggestion {
  field: string;
  rule: string;
  reason: string;
  implementation: any;
}

class MCPService {
  private client?: Client;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = process.env.ENABLE_MCP === 'true';
    if (this.isEnabled) {
      this.initializeMCP();
    }
  }

  private async initializeMCP() {
    try {
      const transport = new StdioClientTransport({
        command: 'node',
        args: ['mcp-form-server.js'], // Your MCP server implementation
      });

      this.client = new Client(
        {
          name: 'form-creator-client',
          version: '1.0.0',
        },
        {
          capabilities: {
            resources: {},
            tools: {},
          },
        }
      );

      await this.client.connect(transport);
      console.log('MCP client connected successfully');
    } catch (error) {
      console.error('Failed to initialize MCP:', error);
      this.isEnabled = false;
    }
  }

  async getFormTemplates(category?: string): Promise<MCPFormTemplate[]> {
    if (!this.isEnabled || !this.client) {
      return this.getFallbackTemplates();
    }

    try {
      const result = await this.client.callTool({
        name: 'get_form_templates',
        arguments: { category }
      });

      return result.content as MCPFormTemplate[];
    } catch (error) {
      console.error('MCP template fetch error:', error);
      return this.getFallbackTemplates();
    }
  }

  async getValidationSuggestions(formStructure: any): Promise<MCPValidationSuggestion[]> {
    if (!this.isEnabled || !this.client) {
      return this.getFallbackValidationSuggestions(formStructure);
    }

    try {
      const result = await this.client.callTool({
        name: 'suggest_validations',
        arguments: { formStructure }
      });

      return result.content as MCPValidationSuggestion[];
    } catch (error) {
      console.error('MCP validation suggestion error:', error);
      return this.getFallbackValidationSuggestions(formStructure);
    }
  }

  async getComplianceChecks(formStructure: any): Promise<any[]> {
    if (!this.isEnabled || !this.client) {
      return [];
    }

    try {
      const result = await this.client.callTool({
        name: 'check_compliance',
        arguments: { formStructure }
      });

      return result.content as any[];
    } catch (error) {
      console.error('MCP compliance check error:', error);
      return [];
    }
  }

  private getFallbackTemplates(): MCPFormTemplate[] {
    return [
      {
        id: 'contact-form',
        name: 'Contact Form',
        description: 'Standard contact form with name, email, and message',
        category: 'general',
        structure: {
          pages: [{
            sections: [{
              title: 'Contact Information',
              rows: [
                {
                  elements: [{
                    type: 'text',
                    label: 'Full Name',
                    name: 'fullName',
                    required: true
                  }]
                },
                {
                  elements: [{
                    type: 'email',
                    label: 'Email Address',
                    name: 'email',
                    required: true
                  }]
                },
                {
                  elements: [{
                    type: 'textarea',
                    label: 'Message',
                    name: 'message',
                    required: true
                  }]
                }
              ]
            }]
          }]
        },
        validationRules: {
          fullName: { required: true, min: 2 },
          email: { required: true, email: true },
          message: { required: true, min: 10 }
        },
        bestPractices: [
          'Keep contact forms simple and focused',
          'Always validate email addresses',
          'Provide clear success/error messages'
        ]
      },
      {
        id: 'registration-form',
        name: 'User Registration',
        description: 'User registration form with validation',
        category: 'authentication',
        structure: {
          pages: [{
            sections: [{
              title: 'Account Information',
              rows: [
                {
                  elements: [{
                    type: 'text',
                    label: 'Username',
                    name: 'username',
                    required: true
                  }]
                },
                {
                  elements: [{
                    type: 'email',
                    label: 'Email',
                    name: 'email',
                    required: true
                  }]
                },
                {
                  elements: [{
                    type: 'password',
                    label: 'Password',
                    name: 'password',
                    required: true
                  }]
                }
              ]
            }]
          }]
        },
        validationRules: {
          username: { required: true, min: 3, matches: /^[a-zA-Z0-9_]+$/ },
          email: { required: true, email: true },
          password: { required: true, min: 8, matches: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ }
        },
        bestPractices: [
          'Enforce strong password requirements',
          'Validate username uniqueness',
          'Provide real-time validation feedback'
        ]
      }
    ];
  }

  private getFallbackValidationSuggestions(formStructure: any): MCPValidationSuggestion[] {
    const suggestions: MCPValidationSuggestion[] = [];

    // Analyze form structure and suggest validations
    if (formStructure.pages) {
      formStructure.pages.forEach((page: any) => {
        page.sections?.forEach((section: any) => {
          section.rows?.forEach((row: any) => {
            row.elements?.forEach((element: any) => {
              switch (element.type) {
                case 'email':
                  suggestions.push({
                    field: element.name,
                    rule: 'email',
                    reason: 'Email fields should validate email format',
                    implementation: { email: true }
                  });
                  break;
                case 'tel':
                  suggestions.push({
                    field: element.name,
                    rule: 'phone',
                    reason: 'Phone fields should validate phone number format',
                    implementation: { matches: /^\+?[\d\s\-\(\)]+$/ }
                  });
                  break;
                case 'password':
                  suggestions.push({
                    field: element.name,
                    rule: 'strong_password',
                    reason: 'Password should meet security requirements',
                    implementation: { 
                      min: 8,
                      matches: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/
                    }
                  });
                  break;
              }
            });
          });
        });
      });
    }

    return suggestions;
  }
}

export const mcpService = new MCPService();