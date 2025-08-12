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
  attachments?: FileAttachment[];
  suggestions?: string[];
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface FormAnalytics {
  id: string;
  formId: string;
  views: number;
  submissions: number;
  completionRate: number;
  averageTime: number;
  dropoffPoints: { [key: string]: number };
  deviceStats: { mobile: number; desktop: number; tablet: number };
  createdAt: string;
}

export interface FormTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: 'compact' | 'normal' | 'spacious';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}

export interface FormIntegration {
  id: string;
  formId: string;
  type: 'webhook' | 'email' | 'zapier' | 'slack' | 'sheets' | 'crm';
  config: any;
  isActive: boolean;
}

export interface SelectedElement {
  type: 'form' | 'page' | 'section' | 'row' | 'element';
  id: string;
  name: string;
  data: any;
  path?: string;
}

export interface DragItem {
  id: string;
  type: 'element' | 'row' | 'section';
  data: any;
}

export interface ElementTemplate {
  id: string;
  type: string;
  label: string;
  icon: string;
  category: 'basic' | 'advanced' | 'layout' | 'media';
  defaultProps: Partial<FormElement>;
}

export interface FormBuilderState {
  selectedElement: SelectedElement | null;
  draggedItem: DragItem | null;
  showPropertyPanel: boolean;
  activePageId: string | null;
}