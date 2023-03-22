'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    return queryInterface.bulkInsert(options, [
      {
        venueId: 1,
        groupId: 1,
        name: "Inital meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2023, 10, 26, 9, 0, 0),
        endDate: new Date(2023, 10, 26, 10, 0, 0)
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Second meetup",
        description: "A meeting of the minds",
        type: "In person",
        capacity: 15,
        price: 10,
        startDate: new Date(2023, 9, 20, 8, 0, 0),
        endDate: new Date(2023, 9, 20, 9, 0, 0)
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Inital meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 20,
        price: 5,
        startDate: new Date(2023, 8, 10, 6, 0, 0),
        endDate: new Date(2023, 8, 10, 7, 0, 0)
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
