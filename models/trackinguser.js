'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TrackingUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.belongsTo(models.PrivateTravel, {
        foreignKey: 'private_travel_id',
        as: 'private_travel',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  // delete this table
  TrackingUser.init({

  }, {
    sequelize,
    underscored: true,
    tableName: 'tracking_users',
    modelName: 'TrackingUser',
  });
  return TrackingUser;
};