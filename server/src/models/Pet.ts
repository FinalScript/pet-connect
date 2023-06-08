import { CreationOptional, DataTypes, HasOneSetAssociationMixin, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../db/connection';
import { ProfilePicture, ProfilePictureCreationDAO } from './ProfilePicture';

export interface PetCreationDAO {
  username: string;
  name: string;
  type: string;
  description?: string;
  location?: string;
  profilePicture?: string;
}
export interface PetUpdateDAO {
  username?: string;
  name?: string;
  type?: string;
  description?: string;
  location?: string;
}

export class Pet extends Model<InferAttributes<Pet>, InferCreationAttributes<Pet>> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare name: string;
  declare type: string;
  declare description: CreationOptional<string>;
  declare location: CreationOptional<string>;
  declare setProfilePicture: HasOneSetAssociationMixin<ProfilePicture, 'id'>;
}

Pet.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
