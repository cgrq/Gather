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
        startDate: new Date(2021, 11, 26, 9, 0, 0),
        endDate: new Date(2021, 11, 26, 10, 0, 0)
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Second meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2022, 11, 26, 9, 0, 0),
        endDate: new Date(2022, 11, 26, 10, 0, 0)
      },
      {
        venueId: 1,
        groupId: 1,
        name: "Third meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2023, 11, 26, 9, 0, 0),
        endDate: new Date(2023, 11, 26, 10, 0, 0)
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Inital meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2021, 11, 26, 9, 0, 0),
        endDate: new Date(2021, 11, 26, 10, 0, 0)
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Second meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2022, 11, 26, 9, 0, 0),
        endDate: new Date(2022, 11, 26, 10, 0, 0)
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Third meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2023, 11, 26, 9, 0, 0),
        endDate: new Date(2023, 11, 26, 10, 0, 0)
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Inital meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2021, 11, 26, 9, 0, 0),
        endDate: new Date(2021, 11, 26, 10, 0, 0)
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Second meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2022, 11, 26, 9, 0, 0),
        endDate: new Date(2022, 11, 26, 10, 0, 0)
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Third meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2023, 11, 26, 9, 0, 0),
        endDate: new Date(2023, 11, 26, 10, 0, 0)
      },
      {
        venueId: 4,
        groupId: 4,
        name: "Inital meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2021, 11, 26, 9, 0, 0),
        endDate: new Date(2021, 11, 26, 10, 0, 0)
      },
      {
        venueId: 4,
        groupId: 4,
        name: "Second meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2022, 11, 26, 9, 0, 0),
        endDate: new Date(2022, 11, 26, 10, 0, 0)
      },
      {
        venueId: 4,
        groupId: 4,
        name: "Third meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2023, 11, 26, 9, 0, 0),
        endDate: new Date(2023, 11, 26, 10, 0, 0)
      },
      {
        venueId: 5,
        groupId: 5,
        name: "Inital meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2021, 11, 26, 9, 0, 0),
        endDate: new Date(2021, 11, 26, 10, 0, 0)
      },
      {
        venueId: 5,
        groupId: 5,
        name: "Second meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2022, 11, 26, 9, 0, 0),
        endDate: new Date(2022, 11, 26, 10, 0, 0)
      },
      {
        venueId: 5,
        groupId: 5,
        name: "Third meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2023, 11, 26, 9, 0, 0),
        endDate: new Date(2023, 11, 26, 10, 0, 0)
      },
      {
        venueId: 6,
        groupId: 6,
        name: "Inital meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2021, 11, 26, 9, 0, 0),
        endDate: new Date(2021, 11, 26, 10, 0, 0)
      },
      {
        venueId: 6,
        groupId: 6,
        name: "Second meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2022, 11, 26, 9, 0, 0),
        endDate: new Date(2022, 11, 26, 10, 0, 0)
      },
      {
        venueId: 6,
        groupId: 6,
        name: "Third meetup",
        description: "A meeting of the minds",
        type: "Online",
        capacity: 10,
        price: 0,
        startDate: new Date(2023, 11, 26, 9, 0, 0),
        endDate: new Date(2023, 11, 26, 10, 0, 0)
      },
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
