import { DataTypes, HasOneSetAssociationMixin, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/connection';
import { Owner } from './Owner';
import { Post } from './Post';

export interface CommentAttributes {
  id: string;
  text: string;
  ownerId: string;
  postId: string;
}

export interface CommentCreationAttributes extends Optional<CommentAttributes, 'id'> {}

export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {
  public id!: string;
  public text!: string;
  declare ownerId: string;
  declare postId: string;
  declare author?: Owner;
  declare setAuthor: HasOneSetAssociationMixin<Owner, 'id'>;
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
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    tableName: 'comments',
  }
);
