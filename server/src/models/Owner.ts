import { Pet } from './Pet';
import { CreationOptional, DataTypes, HasManyAddAssociationMixin, InferAttributes, InferCreationAttributes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from '../db/connection';

export interface OwnerCreationDAO {
  authId: string;
  name?: string;
  username: string;
  location?: string;
}
export class Owner extends Model<InferAttributes<Owner>, InferCreationAttributes<Owner>> {
  declare id: CreationOptional<number>;
  declare authId: CreationOptional<string>;
  declare name: CreationOptional<string>;
  declare username: string;
  declare location: CreationOptional<string>;
  declare pets?: Pet[];
  declare addPet: HasManyAddAssociationMixin<InferAttributes<Pet>, InferCreationAttributes<Pet>>;
}

Owner.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    authId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize, // We need to pass the connection instance
    createdAt: 'dateCreated',
    updatedAt: 'updateTimestamp',
  }
);
