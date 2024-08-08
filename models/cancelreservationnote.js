'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CancelReservationNote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Reservation, {
        foreignKey: 'reservation_id',
        as: 'reservation'
      });
      this.belongsTo(models.PrivateTravel, {
        foreignKey: 'private_travel_id',
        as: 'private_travel'
      });
    }
  }
  // delete this table
  CancelReservationNote.init({
    note: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'cancel_reservation_notes',
    modelName: 'CancelReservationNote',
  });
  return CancelReservationNote;
};