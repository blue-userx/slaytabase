'use strict';
export default async (sequelize, DataTypes) => {
  const {
    Model
  } = await import('sequelize');
  class CustomCommand extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CustomCommand.init({
    guild: DataTypes.STRING,
    call: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CustomCommand',
  });
  return CustomCommand;
};