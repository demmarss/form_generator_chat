import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { Form, FormElement } from '../types';

interface LLMConfig {
  provider: 'openai' | 'anthropic';
  model: string;
  apiKey: string;
}

interface FormGenerationRequest {
  prompt: string;
  selectedElements?: any[];
  context?: {
    existingForms?: Form[];
    userPreferences?: any;
  };
}

interface FormGenerationResponse {
  form: any;
  explanation: string;
  suggestions: string[];
  clarifyingQuestions?: string[];
}

class LLMService {
  private openai?: OpenAI;
  private anthropic?: Anthropic;
  private config: LLMConfig;

  constructor() {
    this.config = {
      provider: (process.env.LLM_PROVIDER as 'openai' | 'anthropic') || 'openai',
      model: process.env.LLM_MODEL || 'gpt-4',
      apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || ''
    };

    this.initializeClients();
  }

  private initializeClients() {
    if (this.config.provider === 'openai' && process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }

    if (this.config.provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });
    }
  }

  async generateForm(request: FormGenerationRequest): Promise<FormGenerationResponse> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildUserPrompt(request);

    try {
      let response: string;

      if (this.config.provider === 'openai' && this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: this.config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 4000
        });

        response = completion.choices[0]?.message?.content || '';
      } else if (this.config.provider === 'anthropic' && this.anthropic) {
        const completion = await this.anthropic.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          messages: [
            { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
          ]
        });

        response = completion.content[0]?.type === 'text' ? completion.content[0].text : '';
      } else {
        throw new Error('No LLM provider configured or API key missing');
      }

      return this.parseFormResponse(response);
    } catch (error) {
      console.error('LLM Generation Error:', error);
      throw new Error('Failed to generate form with LLM');
    }
  }

  private buildSystemPrompt(): string {
    return `You are an expert form designer and developer. Your task is to generate comprehensive, user-friendly forms based on natural language descriptions.

FORM STRUCTURE:
- Forms can have multiple pages (isMultiPage: boolean)
- Each page contains sections
- Each section contains rows
- Each row contains elements (form fields)

SUPPORTED ELEMENT TYPES:
- text, email, tel, url, password
- textarea
- select, radio, checkbox
- file (for uploads)
- signature
- date, datetime-local, time
- number, range
- info (for instructions/information display)

ELEMENT PROPERTIES:
- type: element type
- label: display label
- name: unique field name (camelCase)
- placeholder: placeholder text
- required: boolean
- validation: Yup validation rules
- options: for select/radio/checkbox (array of {label, value})
- conditionalLogic: show/hide based on other fields
- properties: additional element-specific properties

VALIDATION RULES (using Yup):
- string(), number(), boolean(), date()
- required(), min(), max(), email(), url()
- matches() for regex patterns
- oneOf() for specific values

CONDITIONAL LOGIC:
- field: target field name
- operator: 'equals', 'not_equals', 'contains', 'greater_than', etc.
- value: comparison value
- action: 'show' or 'hide'

RESPONSE FORMAT:
Return a JSON object with:
{
  "form": { /* complete form structure */ },
  "explanation": "Brief explanation of the generated form",
  "suggestions": ["suggestion1", "suggestion2"],
  "clarifyingQuestions": ["question1", "question2"] // optional
}

BEST PRACTICES:
- Use clear, descriptive labels
- Group related fields in sections
- Add appropriate validation
- Include helpful placeholder text
- Consider user experience and accessibility
- Use conditional logic to reduce form complexity
- Add info elements for instructions when needed`;
  }

  private buildUserPrompt(request: FormGenerationRequest): string {
    let prompt = `Generate a form based on this description: "${request.prompt}"`;

    if (request.selectedElements && request.selectedElements.length > 0) {
      prompt += `\n\nThe user has selected these existing elements to reference or modify:\n`;
      request.selectedElements.forEach((element, index) => {
        prompt += `${index + 1}. ${element.name} (${element.type}): ${JSON.stringify(element.data)}\n`;
      });
    }

    if (request.context?.existingForms && request.context.existingForms.length > 0) {
      prompt += `\n\nExisting forms in the system for reference:\n`;
      request.context.existingForms.slice(0, 3).forEach((form, index) => {
        prompt += `${index + 1}. "${form.title}" - ${form.description || 'No description'}\n`;
      });
    }

    prompt += `\n\nPlease generate a complete, production-ready form structure with proper validation, user-friendly design, and best practices.`;

    return prompt;
  }

  private parseFormResponse(response: string): FormGenerationResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!parsed.form) {
        throw new Error('Invalid response structure: missing form');
      }

      // Ensure required form properties
      const form = {
        title: parsed.form.title || 'Generated Form',
        subtitle: parsed.form.subtitle || '',
        description: parsed.form.description || '',
        isMultiPage: parsed.form.isMultiPage || false,
        status: 'draft' as const,
        pages: parsed.form.pages || [{
          title: 'Page 1',
          pageNumber: 1,
          sections: parsed.form.sections || []
        }],
        ...parsed.form
      };

      return {
        form,
        explanation: parsed.explanation || 'Form generated successfully',
        suggestions: parsed.suggestions || [],
        clarifyingQuestions: parsed.clarifyingQuestions
      };
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      
      // Fallback to basic form generation
      return {
        form: this.generateFallbackForm(response),
        explanation: 'Generated a basic form structure due to parsing issues',
        suggestions: ['Consider providing more specific requirements'],
        clarifyingQuestions: ['What specific fields do you need in this form?']
      };
    }
  }

  private generateFallbackForm(prompt: string): any {
    // Basic fallback form generation logic
    const hasName = prompt.toLowerCase().includes('name');
    const hasEmail = prompt.toLowerCase().includes('email');
    const hasPhone = prompt.toLowerCase().includes('phone');
    const hasMessage = prompt.toLowerCase().includes('message');

    const elements = [];
    let elementNumber = 1;

    if (hasName) {
      elements.push({
        type: 'text',
        label: 'Full Name',
        name: 'fullName',
        required: true,
        elementNumber: elementNumber++
      });
    }

    if (hasEmail) {
      elements.push({
        type: 'email',
        label: 'Email Address',
        name: 'email',
        required: true,
        validation: { email: true },
        elementNumber: elementNumber++
      });
    }

    if (hasPhone) {
      elements.push({
        type: 'tel',
        label: 'Phone Number',
        name: 'phone',
        required: false,
        elementNumber: elementNumber++
      });
    }

    if (hasMessage) {
      elements.push({
        type: 'textarea',
        label: 'Message',
        name: 'message',
        required: true,
        elementNumber: elementNumber++
      });
    }

    if (elements.length === 0) {
      elements.push({
        type: 'text',
        label: 'Input Field',
        name: 'input1',
        required: false,
        elementNumber: 1
      });
    }

    return {
      title: 'Generated Form',
      subtitle: 'Created from your description',
      description: prompt,
      isMultiPage: false,
      status: 'draft',
      pages: [{
        title: 'Page 1',
        pageNumber: 1,
        sections: [{
          title: 'Main Section',
          sectionNumber: 1,
          rows: [{
            rowNumber: 1,
            rowName: 'row_1',
            elements
          }]
        }]
      }]
    };
  }

  async askClarifyingQuestion(context: string, userResponse: string): Promise<string> {
    const prompt = `Based on this form creation context: "${context}"
    
User response: "${userResponse}"

Ask a single, specific clarifying question to better understand the user's requirements for their form. Focus on:
- Missing required fields
- Validation requirements
- Form structure (single/multi-page)
- Specific business logic
- User experience preferences

Keep the question conversational and helpful.`;

    try {
      if (this.config.provider === 'openai' && this.openai) {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 200
        });

        return completion.choices[0]?.message?.content || 'Could you provide more details about your form requirements?';
      } else if (this.config.provider === 'anthropic' && this.anthropic) {
        const completion = await this.anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 200,
          messages: [{ role: 'user', content: prompt }]
        });

        return completion.content[0]?.type === 'text' ? completion.content[0].text : 'Could you provide more details about your form requirements?';
      }
    } catch (error) {
      console.error('Error generating clarifying question:', error);
    }

    return 'Could you provide more details about your form requirements?';
  }
}

export const llmService = new LLMService();