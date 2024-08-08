'use strict';
const {
  Model
} = require('sequelize');
const {reservation_status} = require('./enum.json');
module.exports = (sequelize, DataTypes) => {
  class PrivateTravel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.Line, {
      //   foreignKey: 'line_id',
      //   as: 'line'
      // });
      this.belongsTo(models.Bus, {
        foreignKey: 'bus_id',
        as: 'bus'
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      // this.belongsTo(models.User, {
      //   foreignKey: 'from_driver_id',
      //   as: 'from_driver'
      // });
      this.hasMany(models.CancelReservationNote, {
        foreignKey: 'private_travel_id',
        as: 'cancel_notes'
      });
      this.hasMany(models.ReservationExtra, {
        foreignKey: 'private_travel_id',
        as: 'reservation_extra',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.TrackingUser, {
        foreignKey: 'private_travel_id',
        as: 'tracking_users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  PrivateTravel.init({
    going_from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    going_to: {
      type: DataTypes.STRING,
      allowNull: false
    },
    going_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // returning_date: {
    //   type: DataTypes.DATETIME,
    //   allowNull: false,
    // },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DOUBLE,
      // allowNull: false,
    },
    lon: {
      type: DataTypes.DOUBLE,
      // allowNull: false,
    },
    lat_back: {
      type: DataTypes.DOUBLE,
      // allowNull: false,
      defaultValue: null
    },
    lon_back: {
      type: DataTypes.DOUBLE,
      // allowNull: false,
      defaultValue: null
    },
    code: {
      type: DataTypes.STRING,
      // type: DataTypes.STRING(12),
      // defaultValue: generateRandomCode,
      allowNull: false,
      defaultValue: ''
    },
    status: {
      type: DataTypes.ENUM,
      values: reservation_status,
      allowNull: false,
      defaultValue: 'pending'
    },
    is_redirected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'private_travels',
    modelName: 'PrivateTravel',
  });
  return PrivateTravel;
};

function generateRandomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}