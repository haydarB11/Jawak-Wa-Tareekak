'use strict';
const {user_type, language} = require('./enum.json');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    generateToken(){
      const token = jwt.sign({ id: this.id, user : this.user }, process.env.SECRETKEY);
      return token;
    }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Bus, {
        foreignKey: 'user_id',
        as: 'bus'
      });
      this.hasMany(models.PrivateTravel, {
        foreignKey: 'user_id',
        as: 'private_travels'
      });
      this.hasMany(models.Reservation, {
        foreignKey: 'user_id',
        as: 'reservations'
      });
      this.hasMany(models.NotificationUser, {
        foreignKey: 'user_id',
        as: 'notification_users'
      });
      this.hasMany(models.TrackingUser, {
        foreignKey: 'user_id',
        as: 'tracking_users',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.DriverHoliday, {
        foreignKey: 'driver_id',
        as: 'driver_holidays',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.Commission, {
        foreignKey: 'driver_id',
        as: 'commissions',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.DriverAd, {
        foreignKey: 'driver_id',
        as: 'driver_ads',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {  // it is noy working why is this
        args: true,
        msg: "phone number already used"
      }
    },
    type: {
      type: DataTypes.ENUM,
      values: user_type,
      defaultValue: 'user',
      allowNull: false,
    },
    language: {
      type: DataTypes.ENUM,
      values: language,
      defaultValue: 'ar',
      allowNull: false,
    },
    // country: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    commission_limit: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0,
    },
    payment: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    is_activated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }

  }, {
    sequelize,
    underscored: true,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};