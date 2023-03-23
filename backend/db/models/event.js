'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage,{foreignKey:"eventId",hooks:true});
      Event.hasMany(models.Attendance,{foreignKey:"eventId",hooks:true});
      Event.belongsTo(models.Venue,{foreignKey:"venueId"});
      Event.belongsTo(models.Group,{foreignKey:"groupId"});
    }
  }
  Event.init({
    venueId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull:false
    },
    type: {
      type:DataTypes.ENUM('In person', 'Online'),
      allowNull:false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
    price: {
      type:DataTypes.DECIMAL
    },
    startDate: {
      allowNull:false,
      type:DataTypes.DATE
    },
    endDate: {
      allowNull:false,
      type:DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
