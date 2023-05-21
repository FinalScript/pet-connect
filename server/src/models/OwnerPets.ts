import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../db/connection';

export const OwnerPets = sequelize.define(
    'OwnerPets',
    {
        ownerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Owners', // 'Owners' refers to table name
                key: 'id',
            },
        },
        petId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Pets', // 'Pets' refers to table name
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
