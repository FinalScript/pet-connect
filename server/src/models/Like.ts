import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from '../db/connection';
import { Post } from './Post';
import { Owner } from './Owner';

export interface LikeAttributes {
  id: string;
  ownerId: string;
  postId: string;
}

export interface LikeCreationAttributes extends Optional<LikeAttributes, 'id'> {
    
}

export class Like extends Model<LikeAttributes, LikeCreationAttributes> {
  public id!: string;
  public ownerId!: string;
  public postId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Like.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Owner,
        key: 'id',
      },
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Post,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'likes',
    createdAt: 'dateCreated',
    updatedAt: 'updateTimestamp',
  }
);