'use strict';
const {
  Model
} = require('sequelize');
const {travel_type} = require('./enum.json');
module.exports = (sequelize, DataTypes) => {
  class Line extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Travel, {
        foreignKey: 'line_id',
        as: 'travels'
      });
      this.hasMany(models.Bus, {
        foreignKey: 'line_id',
        as: 'buses'
      });
    }
  }
  Line.init({
    point_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    point_b: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // private without line ********************************
    // type: {
    //   type: DataTypes.ENUM,
    //   values: travel_type,
    //   defaultValue: 'public',
    //   allowNull: false,
    // },
  }, {
    sequelize,
    underscored: true,
    tableName: 'lines',
    modelName: 'Line',
  });
  return Line;
};