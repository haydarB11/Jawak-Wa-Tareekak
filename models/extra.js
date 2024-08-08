'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Extra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.ReservationExtra, {
        foreignKey: 'extra_id',
        as: 'reservation_extra'
      });
    }
  }
  // delete this table
  Extra.init({
    title_en: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    title_ar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'extras',
    modelName: 'Extra',
  });
  return Extra;
};