import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PageAttributes {
  id: string;
  formId: string;
  title: string;
  description?: string;
  pageNumber: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PageCreationAttributes extends Optional<PageAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Page extends Model<PageAttributes, PageCreationAttributes> implements PageAttributes {
  public id!: string;
  public formId!: string;
  public title!: string;
  public description?: string;
  public pageNumber!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Page.init(
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pageNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Page',
    tableName: 'pages',
    timestamps: true
  }
);

export default Page;