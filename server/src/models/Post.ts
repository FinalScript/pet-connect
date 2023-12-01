import { DataTypes, HasOneSetAssociationMixin, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/connection';
import { Pet } from './Pet';
import { Media } from './Media';

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
  declare setMedia: HasOneSetAssociationMixin<Media, 'id'>;
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
  },
  {
    sequelize,
    tableName: 'posts',
    createdAt: 'dateCreated',
    updatedAt: 'updateTimestamp',
  }
);
