import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../db/connection';

export interface ProfilePictureCreationDAO {
  path: string;
  url: string;
  name: string;
  type: string;
}
export class ProfilePicture extends Model<InferAttributes<ProfilePicture>, InferCreationAttributes<ProfilePicture>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare url: string;
  declare path: string;
  declare type: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
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
      allowNull: false,
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
