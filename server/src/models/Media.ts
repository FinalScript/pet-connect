import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../db/connection';

export interface MediaCreationDAO {
  path: string;
  url: string;
  name: string;
  type: string;
  aspectRatio: number;
}
export class Media extends Model<InferAttributes<Media>, InferCreationAttributes<Media>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare url: string;
  declare path: string;
  declare type: string;
  declare aspectRatio: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
}

Media.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    aspectRatio: {
      type: DataTypes.FLOAT,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'dateCreated',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updateTimestamp',
    },
  },
  {
    sequelize,
  }
);
