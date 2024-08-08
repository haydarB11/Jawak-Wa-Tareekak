'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StaticContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StaticContent.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    description_en: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    description_ar: {
      type: DataTypes.TEXT,
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
    is_show: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    underscored: true,
    tableName: 'static_contents',
    modelName: 'StaticContent',
  });
  return StaticContent;
};