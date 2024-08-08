'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReservationExtra extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Reservation, {
      //   foreignKey: 'reservation_id',
      //   as: 'reservation'
      // });
      this.belongsTo(models.PrivateTravel, {
        foreignKey: 'private_travel_id',
        as: 'private_travel',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.belongsTo(models.Extra, {
        foreignKey: 'extra_id',
        as: 'extra'
      });
    }
  }
  // delete this table
  ReservationExtra.init({
  }, {
    sequelize,
    underscored: true,
    tableName: 'reservation_extra',
    modelName: 'ReservationExtra',
  });
  return ReservationExtra;
};