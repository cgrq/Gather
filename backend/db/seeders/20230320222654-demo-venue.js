'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        address: "123 Gateway",
        city: "Tempe",
        state: "Arizona",
        lat: 16.122331,
        lng: 125.23321
      },
      {
        groupId: 2,
        address: "12 Binary",
        city: "Pheonix",
        state: "Arizona",
        lat: 12.122331,
        lng: 124.23321
      },
      {
        groupId: 3,
        address: "121 Baywatch",
        city: "San Francisco",
        state: "California",
        lat: 18.122331,
        lng: 122.23321
      },
      {
        groupId: 4,
        address: "101 Mission",
        city: "San Francisco",
        state: "California",
        lat: 11.122331,
        lng: 121.23321
      },
      {
        groupId: 5,
        address: "341 Main",
        city: "San Francisco",
        state: "California",
        lat: 19.122331,
        lng: 190.23321
      },{
        groupId: 6,
        address: "901 2nd",
        city: "San Francisco",
        state: "California",
        lat: 29.122331,
        lng: 90.23321
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
