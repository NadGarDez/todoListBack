import { Model, DataTypes, Optional, Sequelize } from 'sequelize'; // archivo traducido a typescript a partir del archivo autogenerado

export interface TaskAttributes {
  id?: number;
  title: string;
  description: string | null;
  labels: string[];
  done: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description!: string | null;
  public labels!: string[];
  public done!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
  }
}

export const initTaskModel = (sequelize: Sequelize): typeof Task => {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      labels: {
        type: DataTypes.JSON,
        get() {
          const rawValue = this.getDataValue('labels');
          return rawValue ? rawValue : [];
        },
        set(val: string[]) {
          this.setDataValue('labels', val);
        }
      },
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'Tasks',
      timestamps: true,
    }
  );

  return Task;
};

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  return initTaskModel(sequelize);
};