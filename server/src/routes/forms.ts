import express from 'express';
import { Form, Page, Section, Row, Element } from '../models';
import { Op } from 'sequelize';
import { llmService } from '../services/llm';
import { mcpService } from '../services/mcp';

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
    const { prompt, selectedElements, context } = req.body;
    
    // Use real LLM service for form generation
    const result = await llmService.generateForm({
      prompt,
      selectedElements,
      context
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error generating form:', error);
    res.status(500).json({ 
      error: 'Failed to generate form',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get form templates from MCP
router.get('/templates', async (req, res) => {
  try {
    const { category } = req.query;
    const templates = await mcpService.getFormTemplates(category as string);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get validation suggestions
router.post('/validate-suggestions', async (req, res) => {
  try {
    const { formStructure } = req.body;
    const suggestions = await mcpService.getValidationSuggestions(formStructure);
    res.json(suggestions);
  } catch (error) {
    console.error('Error getting validation suggestions:', error);
    res.status(500).json({ error: 'Failed to get validation suggestions' });
  }
});

// Ask clarifying question
router.post('/clarify', async (req, res) => {
  try {
    const { context, userResponse } = req.body;
    const question = await llmService.askClarifyingQuestion(context, userResponse);
    res.json({ question });
  } catch (error) {
    console.error('Error generating clarifying question:', error);
    res.status(500).json({ error: 'Failed to generate clarifying question' });
  }
});

export default router;