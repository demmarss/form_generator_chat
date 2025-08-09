import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface RowAttributes {
  id: string;
  sectionId: string;
  rowNumber: number;
  rowName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RowCreationAttributes extends Optional<RowAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class Row extends Model<RowAttributes, RowCreationAttributes> implements RowAttributes {
  public id!: string;
  public sectionId!: string;
  public rowNumber!: number;
  public rowName!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Row.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    sectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'sections',
        key: 'id'
      }
    },
    rowNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    rowName: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Row',
    tableName: 'rows',
    timestamps: true
  }
);

export default Row;