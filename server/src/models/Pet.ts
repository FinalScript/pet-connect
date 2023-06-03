import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../db/connection';

export interface PetCreationDAO {
  name: string;
  type: string;
  description?: string;
  location?: string;
}
export interface PetUpdateDAO {
  name?: string;
  type?: string;
  description?: string;
  location?: string;
}

export class Pet extends Model<InferAttributes<Pet>, InferCreationAttributes<Pet>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare profilePicture: CreationOptional<Blob>;
  declare type: string;
  declare description: CreationOptional<string>;
  declare location: CreationOptional<string>;
}

Pet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.BLOB,
      // allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('DOG', 'CAT', 'BIRD', 'FISH', 'RABBIT', 'HAMSTER', 'MOUSE', 'GUINEA_PIG', 'HORSE', 'SNAKE', 'OTHER'),
      allowNull: false,
    },
    description: {
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
