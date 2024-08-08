'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  // delete this table
  Banner.init({
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
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'banners',
    modelName: 'Banner',
  });
  return Banner;
};