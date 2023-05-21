import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDB, sequelize } from './src/db/connection';
import { Owner } from './src/models/Owner';
import { Pet } from './src/models/Pet';
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello');
});

connectToDB().then(async () => {
    Owner.belongsToMany(Pet, { through: 'OwnerPets' });
    Pet.belongsToMany(Owner, { through: 'OwnerPets' });

    await sequelize.sync({ force: true });

    // create pet and insert // .build for no insert
    const tom = await Pet.create({ name: 'Tom', type: 'CAT' });
    const jerry = await Pet.create({ name: 'Jerry', type: 'MOUSE' });

    // create owner model and not insert
    const ownerOne = Owner.build(
        {
            username: 'Aimen',
        },
        {
            include: [Pet],
        }
    );

    // create owner model and not insert
    const ownerTwo = Owner.build(
        {
            username: 'Roynul',
        },
        {
            include: [Pet],
        }
    );

    // add pet association to  owner
    ownerOne.addPet(tom);

    // insert owner
    await ownerOne.save();

    ownerTwo.addPet(tom);
    ownerTwo.addPet(jerry);

    await ownerTwo.save();

    // find query
    const users = await Owner.findAll({
        attributes: ['username'],
        order: [['username', 'ASC']],
        include: { model: Pet, attributes: ['name'] },
    });

    const pets = await Pet.findAll({
        order: [['name', 'ASC']],
    });

    console.log('All users:', JSON.stringify(users, null, 2));
    console.log('All pets:', JSON.stringify(pets, null, 2));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
