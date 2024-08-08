'use strict';
const {
  Model
} = require('sequelize');
const { reservation_status } = require('./enum.json')
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Travel, {
        foreignKey: 'travel_id',
        as: 'travel',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });    
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });  
      this.hasMany(models.CancelReservationNote, {
        foreignKey: 'reservation_id',
        as: 'cancel_notes'
      });
    }
  }
  Reservation.init({
    // point_a: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   defaultValue: ''
    // },
    // point_b: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   defaultValue: ''
    // },
    going_date: {
      type: DataTypes.DATE,
      allowNull: false,
      // defaultValue: '2024-06-15'
    },
    passengers_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // defaultValue: 1
    }, 
    status: {
      type: DataTypes.ENUM,
      values: reservation_status,
      allowNull: false,
      defaultValue: 'pending'
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'reservations',
    modelName: 'Reservation',
  });
  return Reservation;
};