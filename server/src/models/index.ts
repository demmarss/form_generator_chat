import sequelize from '../config/database';
import Form from './Form';
import Page from './Page';
import Section from './Section';
import Row from './Row';
import Element from './Element';
import FormSubmission from './FormSubmission';

// Define associations
Form.hasMany(Page, { foreignKey: 'formId', as: 'pages', onDelete: 'CASCADE' });
Page.belongsTo(Form, { foreignKey: 'formId', as: 'form' });

Page.hasMany(Section, { foreignKey: 'pageId', as: 'sections', onDelete: 'CASCADE' });
Section.belongsTo(Page, { foreignKey: 'pageId', as: 'page' });

Section.hasMany(Row, { foreignKey: 'sectionId', as: 'rows', onDelete: 'CASCADE' });
Row.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

Row.hasMany(Element, { foreignKey: 'rowId', as: 'elements', onDelete: 'CASCADE' });
Element.belongsTo(Row, { foreignKey: 'rowId', as: 'row' });

Form.hasMany(FormSubmission, { foreignKey: 'formId', as: 'submissions', onDelete: 'CASCADE' });
FormSubmission.belongsTo(Form, { foreignKey: 'formId', as: 'form' });

export {
  sequelize,
  Form,
  Page,
  Section,
  Row,
  Element,
  FormSubmission
};