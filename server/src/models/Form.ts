import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface FormAttributes {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  companyLogo?: string;
  companyAddress?: string;
  isMultiPage: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
}

interface FormCreationAttributes extends Optional<FormAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Form extends Model<FormAttributes, FormCreationAttributes> implements FormAttributes {
  public id!: string;
  public title!: string;
  public subtitle?: string;
  public description?: string;
  public companyLogo?: string;
  public companyAddress?: string;
  public isMultiPage!: boolean;
  public status!: 'draft' | 'published' | 'archived';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Form.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    subtitle: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    companyLogo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    companyAddress: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isMultiPage: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    }
  },
  {
    sequelize,
    modelName: 'Form',
    tableName: 'forms',
    timestamps: true
  }
);

export default Form;