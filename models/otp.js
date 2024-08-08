'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.User, {
      //   foreignKey: 'user_id',
      //   as: 'user',
      //   onDelete: 'CASCADE',
      //   onUpdate:'CASCADE',
      // });
    }
  }
  OTP.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    underscored: true,
    tableName: 'otps',
    modelName: 'OTP',
  });
  return OTP;
};