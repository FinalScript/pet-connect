import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../db/connection';
import { Owner } from './Owner';
import { Pet } from './Pet';

export const OwnerPets = sequelize.define(
  'OwnerPets',
  {
    OwnerId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Owner, // 'Owners' refers to table name
        key: 'id',
      },
    },
    PetId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Pet, // 'Pets' refers to table name
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
    createdAt: 'dateCreated',
    updatedAt: 'updateTimestamp',
  }
);
