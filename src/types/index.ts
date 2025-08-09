export interface FormElement {
  id: string;
  rowId: string;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  validation?: any;
  options?: any;
  conditionalLogic?: any;
  properties?: any;
  elementNumber: number;
}

export interface FormRow {
  id: string;
  sectionId: string;
  rowNumber: number;
  rowName: string;
  elements: FormElement[];
}

export interface FormSection {
  id: string;
  pageId: string;
  title: string;
  description?: string;
  sectionNumber: number;
  rows: FormRow[];
}

export interface FormPage {
  id: string;
  formId: string;
  title: string;
  description?: string;
  pageNumber: number;
  sections: FormSection[];
}

export interface Form {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  companyLogo?: string;
  companyAddress?: string;
  isMultiPage: boolean;
  status: 'draft' | 'published' | 'archived';
  pages: FormPage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  formData?: any;
}

export interface SelectedElement {
  type: 'form' | 'page' | 'section' | 'row' | 'element';
  id: string;
  name: string;
  data: any;
}