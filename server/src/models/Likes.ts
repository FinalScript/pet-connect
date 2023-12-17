import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/connection';

class Like extends Model {}

Like.init(
  {
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Like',
    tableName: 'Likes', // Set the actual table name for the junction table
    timestamps: true, // Add timestamps if needed
  }
);

export default Like;
