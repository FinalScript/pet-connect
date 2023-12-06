import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connection';

export class Follows extends Model {
  declare ownerId: string;
  declare petId: string;
}

Follows.init(
  {
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    petId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Follows',
    timestamps: false, // You may or may not need timestamps in this table
  }
);
