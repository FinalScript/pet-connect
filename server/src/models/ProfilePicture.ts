import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../db/connection';

export interface ProfilePictureCreationDAO {
  path: string;
  name: string;
  type: string;
}
export class ProfilePicture extends Model<InferAttributes<ProfilePicture>, InferCreationAttributes<ProfilePicture>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare path: string;
  declare type: string;
}

ProfilePicture.init(
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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // We need to pass the connection instance
    createdAt: 'dateCreated',
    updatedAt: 'updateTimestamp',
  }
);
