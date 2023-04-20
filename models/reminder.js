'use strict';
export default async (sequelize, DataTypes) => {
  const {
    Model
  } = await import('sequelize');
  class Reminder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Reminder.init({
    user: DataTypes.STRING,
    at: DataTypes.INTEGER,
    contents: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Reminder',
  });
  return Reminder;
};