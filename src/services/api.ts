import { Form } from '../types';

const API_BASE = 'http://localhost:3001/api';

class ApiService {
  async getForms(): Promise<Form[]> {
    const response = await fetch(`${API_BASE}/forms`);
    if (!response.ok) {
      throw new Error('Failed to fetch forms');
    }
    return response.json();
  }

  async getForm(id: string): Promise<Form> {
    const response = await fetch(`${API_BASE}/forms/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch form');
    }
    return response.json();
  }

  async createForm(formData: Partial<Form>): Promise<Form> {
    const response = await fetch(`${API_BASE}/forms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error('Failed to create form');
    }
    return response.json();
  }

  async updateForm(id: string, formData: Partial<Form>): Promise<Form> {
    const response = await fetch(`${API_BASE}/forms/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      throw new Error('Failed to update form');
    }
    return response.json();
  }

  async deleteForm(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/forms/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete form');
    }
  }

  async generateForm(prompt: string, selectedElements?: any[]): Promise<any> {
    const response = await fetch(`${API_BASE}/forms/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, selectedElements }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate form');
    }
    return response.json();
  }
}

export const apiService = new ApiService();