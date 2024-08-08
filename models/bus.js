'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'driver'
      });
      this.hasMany(models.Travel, {
        foreignKey: 'bus_id',
        as: 'travels'
      });
      this.belongsTo(models.Line, {
        foreignKey: 'line_id',
        as: 'line'
      });
    }
  }
  Bus.init({
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // make it string
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'bus',
    modelName: 'Bus',
  });
  return Bus;
};