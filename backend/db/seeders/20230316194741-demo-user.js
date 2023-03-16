'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return  queryInterface.bulkInsert(options, [
      {
        email: 'user1@gmail.com',
        username: 'user1',
        hashedPassword: bcrypt.hashSync('password')
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return  queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['user1'] }
    }, {});
  }
};
