'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DriverAd extends Model {
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
  DriverAd.init({
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    // title_ar: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   defaultValue: ''
    // },
  }, {
    sequelize,
    underscored: true,
    tableName: 'driver_ads',
    modelName: 'DriverAd',
  });
  return DriverAd;
};