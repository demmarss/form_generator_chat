import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface FormSubmissionAttributes {
  id: string;
  formId: string;
  data: object;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FormSubmissionCreationAttributes extends Optional<FormSubmissionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class FormSubmission extends Model<FormSubmissionAttributes, FormSubmissionCreationAttributes> implements FormSubmissionAttributes {
  public id!: string;
  public formId!: string;
  public data!: object;
  public submittedAt!: Date;
  public ipAddress?: string;
  public userAgent?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

FormSubmission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    formId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'forms',
        key: 'id'
      }
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'FormSubmission',
    tableName: 'form_submissions',
    timestamps: true
  }
);

export default FormSubmission;