'use strict';

const bcrypt = require('bcryptjs');

const rawData = require('./seeds/restaurant.json');
const initialData = rawData.results;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction;

    try {
      transaction = await queryInterface.sequelize.transaction();

      await queryInterface.bulkInsert(
        'Users',
        [
          {
            id: 1,
            name: 'user1',
            email: 'user1@example.com',
            password: await bcrypt.hash('12345678', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            name: 'user2',
            email: 'user2@example.com',
            password: await bcrypt.hash('12345678', 10),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      await queryInterface.bulkInsert(
        'Restaurants',
        initialData.map((item) => ({
          id: item.id,
          name: item.name,
          name_en: item.name_en,
          category: item.category,
          image: item.image,
          location: item.location,
          phone: item.phone,
          google_map: item.google_map,
          rating: item.rating,
          description: item.description,
          userId: Math.ceil(item.id / 3) <= 2 ? Math.ceil(item.id / 3) : 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        { transaction }
      );

      await transaction.commit();
      console.log('Seeds created.');
    } catch (error) {
      console.log('Seeds creating failed.');
      console.log(error);
      if (transaction) await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
