'use strict';
export default async (sequelize, DataTypes) => {
  const {
    Model
  } = await import('sequelize');
  class ServerSettings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ServerSettings.init({
    guild: DataTypes.STRING,
    mod: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ServerSettings',
  });
  return ServerSettings;
};