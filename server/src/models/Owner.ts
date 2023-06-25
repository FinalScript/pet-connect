import { Pet } from './Pet';
import { CreationOptional, DataTypes, HasManyAddAssociationMixin, HasOneSetAssociationMixin, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../db/connection';
import { ProfilePicture } from './ProfilePicture';

export interface OwnerCreationDAO {
  authId: string;
  name?: string;
  username: string;
  location?: string;
  profilePicture?: string;
}

export interface OwnerUpdateDAO {
  name?: string;
  username?: string;
  location?: string;
}
export class Owner extends Model<InferAttributes<Owner>, InferCreationAttributes<Owner>> {
  declare id: CreationOptional<number>;
  declare authId: CreationOptional<string>;
  declare name: CreationOptional<string>;
  declare username: string;
  declare location: CreationOptional<string>;
  declare Pets?: Pet[];
  declare addPet: HasManyAddAssociationMixin<InferAttributes<Pet>, InferCreationAttributes<Pet>>;
  declare setProfilePicture: HasOneSetAssociationMixin<ProfilePicture, 'id'>;
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
