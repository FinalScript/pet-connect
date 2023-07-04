import { DataTypes, Sequelize, Model, Optional } from 'sequelize';
import { sequelize } from '../db/connection';
import { Pet } from './Pet';
import { Comment } from './Comment';
import { Like } from './Like';

export interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {

}

export interface PostAttributes {
  id: string;
  petId: string;
  description: string;
  media: Blob[];
}

export class Post extends Model<PostAttributes, PostCreationAttributes> {
  public id: string;
  public petId: string;
  public description: string;
  public media: Blob[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Pet,
        key: 'id',
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    media: {
      //type: DataTypes.ARRAY(DataTypes.BLOB),
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'posts',
    createdAt: 'dateCreated',
    updatedAt: 'updateTimestamp',
  }
);