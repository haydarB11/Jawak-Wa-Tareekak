'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DriverHoliday extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'driver_id',
        as: 'driver',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  // delete this table
  DriverHoliday.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'driver_holidays',
    modelName: 'DriverHoliday',
  });
  return DriverHoliday;
};