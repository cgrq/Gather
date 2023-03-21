'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    return queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Tree Watchers',
        about: "We watch trees",
        type: "Online",
        private: false,
        city: "Tempe",
        state: "Arizona"
      },
      {
        organizerId: 1,
        name: 'People Watchers',
        about: "We watch people",
        type: "In Person",
        private: true,
        city: "Pheonix",
        state: "Arizona"
      },
      {
        organizerId: 2,
        name: 'Water Watchers',
        about: "We watch water",
        type: "In Person",
        private: true,
        city: "San Francisco",
        state: "California"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      organizerId: { [Op.in]: [1, 2] }
    }, {});
  }
};
