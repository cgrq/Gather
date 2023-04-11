'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        groupId: 1,
        status: "organizer(host)"
      },
      {
        userId: 2,
        groupId: 1,
        status: "co-host"
      },
      {
        userId: 1,
        groupId: 2,
        status: "organizer(host)"
      },
      {
        userId: 2,
        groupId: 3,
        status: "organizer(host)"
      },
      {
        userId: 3,
        groupId: 3,
        status: "co-host"
      },
      {
        userId: 2,
        groupId: 4,
        status: "organizer(host)"
      },
      {
        userId: 3,
        groupId: 5,
        status: "organizer(host)"
      },
      {
        userId: 3,
        groupId: 6,
        status: "organizer(host)"
      },
      {
        userId: 4,
        groupId: 1,
        status: "member"
      },
      {
        userId: 4,
        groupId: 2,
        status: "member"
      },
      {
        userId: 4,
        groupId: 3,
        status: "member"
      }
      ,
      {
        userId: 5,
        groupId: 4,
        status: "member"
      },
      {
        userId: 5,
        groupId: 5,
        status: "member"
      },
      {
        userId: 6,
        groupId: 6,
        status: "member"
      },
      {
        userId: 6,
        groupId: 1,
        status: "member"
      },
      {
        userId: 6,
        groupId: 2,
        status: "member"
      },
      {
        userId: 6,
        groupId: 3,
        status: "member"
      }
      ,
      {
        userId: 6,
        groupId: 4,
        status: "member"
      },
      {
        userId: 6,
        groupId: 5,
        status: "member"
      },
      {
        userId: 6,
        groupId: 6,
        status: "member"
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
