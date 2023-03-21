'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.hasMany(models.Event,{foreignKey:"venueId",hooks:true});
      Venue.belongsTo(models.Group,{foreignKey:"groupId"});
    }
  }
  Venue.init({
    groupId: {
      allowNull:false,
      type: DataTypes.INTEGER
    },
    address: {
      allowNull:false,
      type: DataTypes.STRING
    },
    city: {
      allowNull:false,
      type: DataTypes.STRING
    },
    state: {
      allowNull:false,
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL
    },
    lng: {
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
