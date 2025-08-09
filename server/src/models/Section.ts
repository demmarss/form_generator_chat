import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface SectionAttributes {
  id: string;
  pageId: string;
  title: string;
  description?: string;
  sectionNumber: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SectionCreationAttributes extends Optional<SectionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Section extends Model<SectionAttributes, SectionCreationAttributes> implements SectionAttributes {
  public id!: string;
  public pageId!: string;
  public title!: string;
  public description?: string;
  public sectionNumber!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Section.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    pageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'pages',
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
    sectionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Section',
    tableName: 'sections',
    timestamps: true
  }
);

export default Section;