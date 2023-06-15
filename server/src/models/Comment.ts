import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from '../db/connection';
import { Post } from './Post';
import { Owner } from './Owner';

export interface CommentAttributes {
  id: string;
  ownerId: string;
  postId: string;
  text: string;
}

export interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {

}

export class Comment extends Model<CommentAttributes, CommentCreationAttributes> {
  public id!: string;
  public ownerId!: string;
  public postId!: string;
  public text!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Comment.init(
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
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'comments',
    createdAt: 'dateCreated',
    updatedAt: 'updateTimestamp',
  }
);
