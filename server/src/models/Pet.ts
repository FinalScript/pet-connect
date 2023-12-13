import {
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasOneSetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../db/connection';
import { Owner } from './Owner';
import { ProfilePicture } from './ProfilePicture';
import { Post } from './Post';

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
  public id!: string;
  public username!: string;
  public name!: string;
  public type!: string;
  public description?: string | null;
  public location?: string | null;

  public readonly ownerId?: string;

  public readonly Owner?: Owner;
  public readonly Followers?: Owner[];
  public readonly ProfilePicture?: ProfilePicture;
  public readonly Posts?: Post[];

  public followerCount?: number = 0;
  public postsCount?: number = 0;

  public addFollower!: HasManyAddAssociationMixin<Owner, string>;
  public removeFollower!: HasManyRemoveAssociationMixin<Owner, string>;
  public setProfilePicture!: HasOneSetAssociationMixin<ProfilePicture, 'id'>;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
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
    followerCount: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER),
      get() {
        // Use a getter to dynamically fetch follower count
        return sequelize.models.Follows.count({ where: { petId: this.id } });
      },
    },
    postsCount: {
      type: DataTypes.VIRTUAL(DataTypes.INTEGER),
      get() {
        // Use a getter to dynamically fetch posts count
        return sequelize.models.Post.count({ where: { petId: this.id } });
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
    modelName: 'Pet',
  }
);
