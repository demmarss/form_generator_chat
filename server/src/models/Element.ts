import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ElementAttributes {
  id: string;
  rowId: string;
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  validation?: object;
  options?: object;
  conditionalLogic?: object;
  properties?: object;
  elementNumber: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ElementCreationAttributes extends Optional<ElementAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Element extends Model<ElementAttributes, ElementCreationAttributes> implements ElementAttributes {
  public id!: string;
  public rowId!: string;
  public type!: string;
  public label!: string;
  public name!: string;
  public placeholder?: string;
  public required!: boolean;
  public validation?: object;
  public options?: object;
  public conditionalLogic?: object;
  public properties?: object;
  public elementNumber!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Element.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    rowId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'rows',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    placeholder: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    validation: {
      type: DataTypes.JSON,
      allowNull: true
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    conditionalLogic: {
      type: DataTypes.JSON,
      allowNull: true
    },
    properties: {
      type: DataTypes.JSON,
      allowNull: true
    },
    elementNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Element',
    tableName: 'elements',
    timestamps: true
  }
);

export default Element;