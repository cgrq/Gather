'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Event, { foreignKey: "eventId" });
      Attendance.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Attendance.init({
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM("member", "waitlist", "pending")
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
