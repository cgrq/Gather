'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    return queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        url: "https://www.holemanlandscape.com/wp-content/uploads/2014/08/trees.jpg",
        preview: true,
      },
      {
        groupId: 2,
        url: "https://www.brianhonigman.com/wp-content/uploads/2015/10/Large-crowd-of-people-014.jpg",
        preview: true,
      },
      {
        groupId: 3,
        url: "https://cdn.wallpapersafari.com/90/11/VeWpr6.jpg",
        preview: true,
      },
      {
        groupId: 4,
        url: "https://townsquare.media/site/519/files/2014/08/hitchhiking.jpg?w=1200&h=0&zc=1&s=0&a=t&q=89",
        preview: true,
      },
      {
        groupId: 5,
        url: "https://thumbs.dreamstime.com/b/outdoor-basketball-court-19735075.jpg",
        preview: true,
      },
      {
        groupId: 6,
        url: "https://i.redd.it/0saugvugdjy41.jpg",
        preview: true,
      },

    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
