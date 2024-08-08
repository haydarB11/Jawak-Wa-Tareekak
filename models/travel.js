'use strict';
const {
  Model
} = require('sequelize');
const {travel_type, travel_status} = require('./enum.json');
module.exports = (sequelize, DataTypes) => {
  class Travel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Line, {
        foreignKey: 'line_id',
        as: 'line'
      });
      this.belongsTo(models.Bus, {
        foreignKey: 'bus_id',
        as: 'bus'
      });    
      this.hasMany(models.Reservation, {
        foreignKey: 'travel_id',
        as: 'reservations'
      });    
    }
  }
  // type if it is day by day or forever // change in data
  Travel.init({
    going_from: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    starting_pool: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    going_from: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    returning_from: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    returning_pool: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    // time or date
    going_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    // time or date
    returning_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    // starting_date: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    // },
    // ending_date: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    // },
    type: {
      type: DataTypes.ENUM,
      values: travel_type,
      allowNull: false,
      defaultValue: 'public'
    },
    // status: {
    //   type: DataTypes.ENUM,
    //   values: travel_status,
    //   allowNull: false,
    // },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'travels',
    modelName: 'Travel',
  });
  return Travel;
};