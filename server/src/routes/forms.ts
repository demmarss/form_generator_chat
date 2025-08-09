import express from 'express';
import { Form, Page, Section, Row, Element } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.findAll({
      order: [['updatedAt', 'DESC']],
      include: [{
        model: Page,
        as: 'pages',
        include: [{
          model: Section,
          as: 'sections',
          include: [{
            model: Row,
            as: 'rows',
            include: [{
              model: Element,
              as: 'elements',
              order: [['elementNumber', 'ASC']]
            }],
            order: [['rowNumber', 'ASC']]
          }],
          order: [['sectionNumber', 'ASC']]
        }],
        order: [['pageNumber', 'ASC']]
      }]
    });
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Get form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id, {
      include: [{
        model: Page,
        as: 'pages',
        include: [{
          model: Section,
          as: 'sections',
          include: [{
            model: Row,
            as: 'rows',
            include: [{
              model: Element,
              as: 'elements',
              order: [['elementNumber', 'ASC']]
            }],
            order: [['rowNumber', 'ASC']]
          }],
          order: [['sectionNumber', 'ASC']]
        }],
        order: [['pageNumber', 'ASC']]
      }]
    });
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Create new form
router.post('/', async (req, res) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Update form
router.put('/:id', async (req, res) => {
  try {
    const [updatedRowsCount] = await Form.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    const updatedForm = await Form.findByPk(req.params.id);
    res.json(updatedForm);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: 'Failed to update form' });
  }
});

// Delete form
router.delete('/:id', async (req, res) => {
  try {
    const deletedRowsCount = await Form.destroy({
      where: { id: req.params.id }
    });
    
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

// Generate form from prompt
router.post('/generate', async (req, res) => {
  try {
    const { prompt, selectedElements } = req.body;
    
    // Mock AI form generation - in production, integrate with actual LLM
    const generatedForm = await generateFormFromPrompt(prompt, selectedElements);
    
    res.json(generatedForm);
  } catch (error) {
    console.error('Error generating form:', error);
    res.status(500).json({ error: 'Failed to generate form' });
  }
});

// Mock form generation function
async function generateFormFromPrompt(prompt: string, selectedElements?: any[]) {
  // This is a mock implementation - integrate with actual LLM service
  const formData = {
    title: extractTitleFromPrompt(prompt),
    subtitle: 'Generated form',
    description: prompt,
    isMultiPage: prompt.toLowerCase().includes('multi') || prompt.toLowerCase().includes('page'),
    status: 'draft' as const,
    pages: [{
      title: 'Page 1',
      pageNumber: 1,
      sections: [{
        title: 'Main Section',
        sectionNumber: 1,
        rows: generateRowsFromPrompt(prompt, selectedElements)
      }]
    }]
  };
  
  return formData;
}

function extractTitleFromPrompt(prompt: string): string {
  // Simple title extraction - improve with actual NLP
  const words = prompt.split(' ').slice(0, 5);
  return words.join(' ') + ' Form';
}

function generateRowsFromPrompt(prompt: string, selectedElements?: any[]) {
  const rows = [];
  let rowNumber = 1;
  
  // Basic form element detection
  if (prompt.toLowerCase().includes('name')) {
    rows.push({
      rowNumber: rowNumber++,
      rowName: `row_${rowNumber}`,
      elements: [{
        type: 'text',
        label: 'Full Name',
        name: 'fullName',
        required: true,
        elementNumber: 1
      }]
    });
  }
  
  if (prompt.toLowerCase().includes('email')) {
    rows.push({
      rowNumber: rowNumber++,
      rowName: `row_${rowNumber}`,
      elements: [{
        type: 'email',
        label: 'Email Address',
        name: 'email',
        required: true,
        elementNumber: 1
      }]
    });
  }
  
  if (prompt.toLowerCase().includes('phone')) {
    rows.push({
      rowNumber: rowNumber++,
      rowName: `row_${rowNumber}`,
      elements: [{
        type: 'tel',
        label: 'Phone Number',
        name: 'phone',
        required: false,
        elementNumber: 1
      }]
    });
  }
  
  // Add more intelligent parsing based on prompt
  
  return rows.length > 0 ? rows : [{
    rowNumber: 1,
    rowName: 'row_1',
    elements: [{
      type: 'text',
      label: 'Input Field',
      name: 'input1',
      required: false,
      elementNumber: 1
    }]
  }];
}

export default router;