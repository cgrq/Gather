'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      eventId: {
        allowNull: false,
        references:{model:"Events"},
        type: Sequelize.INTEGER,
        onDelete:"CASCADE"
      },
      userId: {
        allowNull: false,
        references:{model:"Users"},
        type: Sequelize.INTEGER,
        onDelete:"CASCADE"
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("attending", "waitlist", "pending")
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    await queryInterface.dropTable(options);
  }
};
