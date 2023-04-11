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
        about: "In botany, a tree is a perennial plant with an elongated stem, or trunk, usually supporting branches and leaves. In some usages, the definition of a tree may be narrower, including only woody plants with secondary growth.",
        type: "Online",
        private: false,
        city: "Tempe",
        state: "Arizona"
      },
      {
        organizerId: 1,
        name: 'People Watchers',
        about: "People-watching or crowd watching is the act of observing people and their interactions as a subconscious doing. Eavesdropping may accompany the activity, though is not required.",
        type: "In person",
        private: true,
        city: "Pheonix",
        state: "Arizona"
      },
      {
        organizerId: 2,
        name: 'Water Watchers',
        about: "Water is an inorganic compound with the chemical formula H₂O. It is a transparent, tasteless, odorless, and nearly colorless chemical substance, and it is the main constituent of Earth's hydrosphere and the fluids of all known living organisms.",
        type: "In person",
        private: true,
        city: "San Francisco",
        state: "California"
      },
      {
        organizerId: 2,
        name: 'Hitch Hikers',
        about: "Hitchhiking is a means of transportation that is gained by asking individuals, usually strangers, for a ride in their car or other vehicle. Nomads have also used hitchhiking as a primary mode of travel for the better part of the last century.",
        type: "In person",
        private: false,
        city: "Tempe",
        state: "Arizona"
      },
      {
        organizerId: 3,
        name: 'Basketball Bunch',
        about: "Basketball is a team sport in which two teams opposing one another on a rectangular court, compete with the primary objective of shooting a basketball through the defender's hoop, while preventing the opposing team from shooting through their own hoop.",
        type: "In person",
        private: true,
        city: "Pheonix",
        state: "Arizona"
      },
      {
        organizerId: 3,
        name: 'Apples Anonymous',
        about: "Are you finding your apple eatingunmanageable? Are you thinking about apples today? Every day? You may have progressively become an apple addict and might need help. Join today.",
        type: "Online",
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
