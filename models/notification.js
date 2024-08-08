'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.NotificationUser, {
        foreignKey: 'notification_id',
        as: 'notification_users'
      });
    }
  }
  // delete this table
  Notification.init({
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
    content_en: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    content_ar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    // is_read: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false
    // }
  }, {
    sequelize,
    underscored: true,
    tableName: 'notifications',
    modelName: 'Notification',
  });
  return Notification;
};