import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Optional,
} from 'sequelize';
import { sequelize } from '../db/connection';
import { Pet } from './Pet';
import { Media } from './Media';
import { Comment } from './Comment';

export interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

export interface PostAttributes {
  id: string;
  petId: string;
  description: string;
  media?: Media;
}

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: string;
  declare petId: string;
  declare description: string;
  declare Media?: Media;
  declare author?: Pet;
  declare setMedia: HasOneSetAssociationMixin<Media, 'id'>;

  public readonly Comments?: Comment[];
  public addComment!: HasManyAddAssociationMixin<Comment, string>;
  public removeComment!: HasManyRemoveAssociationMixin<Comment, string>;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
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
    tableName: 'posts',
  }
);
