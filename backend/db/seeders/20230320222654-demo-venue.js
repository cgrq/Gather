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
        lat: 100.122331,
        lng: 1202.23321
      },
      {
        groupId: 2,
        address: "12 Binary",
        city: "Pheonix",
        state: "Arizona",
        lat: 120.122331,
        lng: 1202.23321
      },
      {
        groupId: 3,
        address: "121 Baywatch",
        city: "San Francisco",
        state: "California",
        lat: 1220.122331,
        lng: 12023.23321
      },
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
